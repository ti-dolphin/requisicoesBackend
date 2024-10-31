var CheckListRepository = require("../repositories/CheckListRepository");
const PersonService = require("../services/PersonService");
const pool = require("../database");
const fireBaseService = require("./fireBaseService");
const utils = require("../utils");
const EmailService = require("../services/EmailService");
class CheckListService {
  static async verifyAndCreateChecklists() {
    const checklists = await this.executeQuery(
      CheckListRepository.getLastChecklistPerMovementationQuery()
    );
    const currentDate = new Date();
    const fifteenDaysInMilliseconds = 15 * 24 * 60 * 60 * 1000;
    for (let checklist of checklists) {
      const { id_checklist_movimentacao, id_movimentacao, data_realizado } =
        checklist;
      if (data_realizado) {
        const dataRealizadoDate = new Date(data_realizado);
        if (currentDate - dataRealizadoDate > fifteenDaysInMilliseconds) {
          console.log("faz mais de 15 dias");
          // await this.executeQuery(CheckListRepository.createChecklistQuery(), [
          //   id_movimentacao,
          // ]);
        }
      }
    }
  }

  static sendChecklistEmails = async () => {
    await this.sendUndoneChecklistEmails();
    await this.sendUnaprovedChecklistEmails();
  };

  static sendUnaprovedChecklistEmails = async () => {
    const unaprovedChecklists = await this.executeQuery(
      CheckListRepository.getUnaprovedChecklists()
    );
    if (unaprovedChecklists.length > 0) {
      for (let checklist of unaprovedChecklists) {
        const {
          id_checklist_movimentacao,
          id_movimentaca,
          data_criacao,
          realizado,
          data_realizado,
          aprovado,
          data_aprovado,
          observacao,
          nome,
          id_patrimonio,
          responsavel_tipo,
          responsavel_movimentacao,
          nome_responsavel_tipo,
          email_responsavel_tipo,
          nome_patrimonio,
        } = checklist;
        const subject = `Checklist não aprovada - Patrimônio ${id_patrimonio} - ${nome_patrimonio}`;
        const message = `  Olá, ${nome_responsavel_tipo},
                          
                          Você deve verificar o checklist do patrimônio ${id_patrimonio} - ${nome_patrimonio}.
                          
                          Observação: ${
                            observacao || "Nenhuma observação disponível"
                          }.
                          
                          Data de criação do checklist: ${this.dateRenderer(
                            `${data_criacao}`
                          )}.
                          
                          Por favor, verifique o checklist o mais rápido possível.
                          
                          Atenciosamente,
                          Atenciosamente, Setor de T.I.`;
        try {
          await EmailService.sendEmail(
            email_responsavel_tipo,
            subject,
            message
          );
          console.log(
            `Email enviado com sucesso para ${nome_responsavel_tipo} (${email_responsavel_tipo})`
          );
        } catch (error) {
          console.error(
            `Erro ao enviar email para ${email_responsavel_tipo}:`,
            error
          );
        }
      }
    }
  };

  static async sendUndoneChecklistEmails() {
    const undoneChecklists = await this.executeQuery(
      CheckListRepository.getUndoneChecklists()
    );
    if (undoneChecklists.length > 0) {
      for (let checklist of undoneChecklists) {
        const {
          id_checklist_movimentacao,
          id_movimentaca,
          data_criacao,
          realizado,
          data_realizado,
          aprovado,
          data_aprovado,
          observacao,
          nome,
          id_patrimonio,
          responsavel_tipo,
          responsavel_movimentacao,
          nome_responsavel_movimentacao,
          email_responsavel_movimentacao,
          nome_patrimonio,
        } = checklist;
        const subject = `Checklist pendente - Patrimônio ${id_patrimonio} - ${nome_patrimonio}`;
        const message = `
                                  Olá, ${nome_responsavel_movimentacao},
                                  
                                  Você deve realizar o checklist do patrimônio ${id_patrimonio} - ${nome_patrimonio}.
                                  
                                  Observação: ${
                                    observacao ||
                                    "Nenhuma observação disponível"
                                  }.
                                  
                                  Data de criação do checklist: ${this.dateRenderer(
                                    `${data_criacao}`
                                  )}.
                                  
                                  Por favor, verifique e realize o checklist o mais rápido possível.
                                  
                                  Atenciosamente,
                                  Atenciosamente, Setor de T.I.`;
        try {
          await EmailService.sendEmail(
            email_responsavel_movimentacao,
            subject,
            message
          );
          console.log(
            `Email enviado com sucesso para ${nome_responsavel_movimentacao} (${email_responsavel_movimentacao})`
          );
        } catch (error) {
          console.error(
            `Erro ao enviar email para ${email_responsavel_movimentacao}:`,
            error
          );
        }
      }
    }
  }

  static dateRenderer = (value) => {
    if (typeof value === "string") {
      const date = value.substring(0, 10).replace(/-/g, "/");
      const time = value.substring(11, 19);
      let formatted = `${date}, ${time}`;
      const localeDate = new Date(formatted).toLocaleDateString();
      formatted = `${localeDate}, ${time}`;
      return formatted;
    }
  };

  static updateChecklistItemfile = async (
    id_item_checklist_movimentacao,
    file
  ) => {
    console.log(
      "id_item_checklist_movimentacao: ",
      id_item_checklist_movimentacao
    );
    if (!file) {
      throw new Error("File not provided");
    }
    const filePath = file.path;
    await fireBaseService.uploadFileToFireBase(filePath);
    const [allFiles] = await fireBaseService.getFilesFromFirebase();
    const createdFile = await fireBaseService.getFileByName(file.filename);
    const fileUrl = createdFile ? createdFile.publicUrl() : null;
    if (fileUrl) {
      const result = await this.executeQuery(
        CheckListRepository.updateCheckListItemfileQuery(),
        [fileUrl, id_item_checklist_movimentacao]
      );
      utils.removeFile(filePath);
      return fileUrl;
    }
  };

  static createChecklistItemFile = async (checklistItemFile, file) => {
    if (!file) {
      throw new Error("File not provided");
    }
    const {
      id_checklist_movimentacao,
      nome_item_checklist,
      arquivo,
      problema,
      valido,
      observacao,
    } = JSON.parse(checklistItemFile);

    const filePath = file.path;
    await fireBaseService.uploadFileToFireBase(filePath);
    const [allFiles] = await fireBaseService.getFilesFromFirebase();
    const createdFile = await fireBaseService.getFileByName(file.filename);
    const fileUrl = createdFile ? createdFile.publicUrl() : null;
    if (fileUrl) {
      await this.executeQuery(
        CheckListRepository.createCheckListItemFileQuery(),
        [
          id_checklist_movimentacao,
          nome_item_checklist,
          fileUrl,
          problema,
          valido,
          observacao,
        ]
      );
      // utils.removeFile(filePath);
      console.log('fileURL: ', fileUrl);
      return fileUrl;
    }
  };

  static getUndoneChecklistsByPatrimony = async (movementation) => {
    const { id_patrimonio } = movementation;
    const undoneChecklists = await this.executeQuery(
      CheckListRepository.getUndoneChecklistsByPatrimony(),
      [id_patrimonio]
    );
    if (undoneChecklists.length > 0) return undoneChecklists;
  };

  static createChecklist = async (checklist) => {
    const {
      id_movimentacao,
      data_criacao,
      realizado,
      data_realizado,
      aprovado,
      data_aprovado,
      observacao,
    } = checklist;
    const result = await this.executeQuery(
      CheckListRepository.createChecklistQuery(),
      [
        id_movimentacao,
        data_criacao,
        realizado,
        data_realizado,
        aprovado,
        data_aprovado,
        observacao,
      ]
    );
    return result.insertId;
  };

  static async updatedChecklist(checklist) {
    const {
      id_checklist_movimentacao,
      id_movimentacao,
      data_criacao,
      realizado,
      data_realizado,
      aprovado,
      data_aprovado,
      observacao,
    } = checklist;

    const result = await this.executeQuery(
      CheckListRepository.updatedChecklistQuery(),
      [
        id_movimentacao,
        data_criacao.replace("T", " ").split(".")[0],
        realizado,
        data_realizado.replace("T", " ").split(".")[0],
        aprovado,
        data_aprovado && data_aprovado.replace("T", " ").split(".")[0],
        observacao,
        id_checklist_movimentacao,
      ]
    );
    this.sendChecklistEmails();
    return result.affectedRows;
  }

  static async updateChecklistItems(checklistItems) {
    console.log("updateChecklistItems");
    const itemsToUpdate = checklistItems.filter(
      (item) => item.id_item_checklist_movimentacao !== 0
    );
    if (itemsToUpdate.length > 0) {
      const { query, paramsArray } =
        CheckListRepository.getUpdateChecklistItemsQuery(itemsToUpdate);
      for (const [query, params] of paramsArray) {
        await this.executeQuery(query, params);
      }
    }
  }

  static async getChecklistItemsMap(
    id_patrimonio,
    id_movimentacao,
    id_checklist_movimentacao
  ) {
    const checklistItems = await this.executeQuery(
      CheckListRepository.getChecklistItemsQuery(),
      [id_patrimonio]
    );

    const checklistItemFiles = await this.executeQuery(
      CheckListRepository.getChecklistItemFilesQuery(),
      [id_checklist_movimentacao]
    );
    const checklistItemsMap = new Map();
    const checklistItemsMapArray = [];

    for (let checklistItem of checklistItems) {
      const checklistItemFile = checklistItemFiles.find(
        (checklistItemFile) =>
          checklistItemFile.nome_item_checklist ===
          checklistItem.nome_item_checklist
      );
      checklistItemsMapArray.push({
        checklistItem,
        checklistItemFile,
      });
    }
    return checklistItemsMapArray;
  }

  static async getChecklistNotifications(CODPESSOA) {
    const notifications = await this.executeQuery(
      CheckListRepository.getChecklistNotificationsQuery(),
      [CODPESSOA, CODPESSOA]
    );
    return notifications;
  }

  static async getChecklistByPatrimonyId(id_patrimonio) {
    console.log("getChecklistByPatrimonyId");
    const checklists = await this.executeQuery(
      CheckListRepository.getChecklistByPatrimonyIdQuery(),
      [id_patrimonio]
    );

    return checklists;
  }

  static async executeQuery(query, params) {
    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query(query, params);
      connection.release();
      return result;
    } catch (queryError) {
      console.log("Error in executeQuery: ", queryError);
      connection.release();
      throw queryError;
    }
  }
}
module.exports = CheckListService;
