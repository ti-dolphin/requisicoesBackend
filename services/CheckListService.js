var CheckListRepository = require("../repositories/CheckListRepository");
const pool = require("../database");
const fireBaseService = require("./fireBaseService");
const utils = require("../utils");
const EmailService = require("../services/EmailService");
class CheckListService {

  static finishChecklistByPatrimonyId = async(patrimonyId )=> { 
    const { affectedRows } = await this.executeQuery(CheckListRepository.finishChecklistByPatrimonyId(), [patrimonyId])
      return affectedRows;
  }

  static  getNonRealizedChecklistByPatrimonyId = async (patrimonyId) => {
    const [nonRealizedChecklist] = await this.executeQuery(CheckListRepository.getNonRealizedByPatrimonyId(), [patrimonyId]);
    return nonRealizedChecklist;
  }

  static async verifyAndCreateChecklists() {
    const checklists = await this.executeQuery(
      CheckListRepository.getLastChecklistPerMovementationQuery()
    );

    const currentDate = new Date();
    for (let checklist of checklists) {
      const {
        id_checklist_movimentacao,
        id_movimentacao,
        data_criacao,
        periodicidade,
        realizado,
      } = checklist;
      if (realizado) {
        const periodicidadeInMilliseconds = periodicidade * 24 * 60 * 60 * 1000;
        const createdDate = new Date(data_criacao);
        if (currentDate - createdDate > periodicidadeInMilliseconds) {
          await this.executeQuery(CheckListRepository.createChecklistQuery(), [
            id_movimentacao,
          ]);
        } else {
          console.log("checklist em dia: ", {
            id_checklist_movimentacao,
            id_movimentacao,
            data_criacao,
            periodicidade,
          });
        }
      }
    }
  }

  static sendChecklistEmails = async () => {
    "";
    await this.sendTobeAprovedChecklistEmails();
    await this.sendUndoneChecklistEmails();
    await this.sendLateUndoneChecklistEmail();
  };

  static sendTobeAprovedChecklistEmails = async (id_checklist_movimentacao) => {
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
        const subject = `Checklist à aprovar - Patrimônio ${id_patrimonio} - ${nome_patrimonio}`;
        const message = `  Olá, ${nome_responsavel_tipo},
                          
                          Você deve verificar o checklist do patrimônio ${id_patrimonio} - ${nome_patrimonio}.
                          
                          Observação: ${
                            observacao || "Nenhuma observação disponível"
                          }.
                          
                          Data de criação do checklist: ${this.dateRenderer(
                            `${data_criacao}`
                          )}.
                          
                          Por favor, verifique o checklist o mais rápido possível.
                          link: controle.dse.com.br
      
                          Atenciosamente, Setor de T.I.`;
        try {
          await EmailService.sendEmail(
            email_responsavel_tipo,
            subject,
            message
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
        const subject = `Checklist à realizar - Patrimônio ${id_patrimonio} - ${nome_patrimonio}`;
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
                                  
                                  Por favor, verifique e realize o checklist o mais rápido possível no sistema de patrimônios.
                                  link: controle.dse.com.br
                                  
                                  Atenciosamente, Setor de T.I.`;
        try {
          await EmailService.sendEmail(
            email_responsavel_movimentacao,
            subject,
            message
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

  static async sendLateUndoneChecklistEmail() {
    const lateChecklists = await this.executeQuery(
      CheckListRepository.getLateUndoneChecklists()
    );
    if (lateChecklists.length > 0) {
      for (let checklist of lateChecklists) {
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
          email_responsavel_tipo,
        } = checklist;
        const subject = `Checklist atrasado! - Patrimônio ${id_patrimonio} - ${nome_patrimonio}`;
        const message = `  Olá, ${nome_responsavel_movimentacao},
                                  A checklist do patrimônio ${id_patrimonio} - ${nome_patrimonio} está atrasado.
                                  Realize o mais rápido possível!
                                  link: controle.dse.com.br`;
        try {
          await EmailService.sendEmail(
            email_responsavel_movimentacao,
            subject,
            message,
            [email_responsavel_tipo]
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

  static async sendUnaprovedChecklistEmail(id_checklist_movimentacao) {
    const unaprovedChecklists = await this.executeQuery(
      CheckListRepository.getUnaprovedChecklistByIdQuery(),
      [id_checklist_movimentacao]
    );
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
        nome_responsavel_movimentacao,
        email_responsavel_movimentacao,
        nome_patrimonio,
        email_responsavel_tipo,
      } = checklist;
      const subject = `Checklist reprovado - Patrimônio ${id_patrimonio} - ${nome_patrimonio}`;
      const message = `Olá ${nome_responsavel_movimentacao}, seu checklist do patrimônio ${nome_patrimonio} foi reprovado, acesse o sistema e reenvie o checklist o mais rápido possível!
        link: controle.dse.com.br
        Atenciosamente, setor de T.I!`;
      try {
        await EmailService.sendEmail(
          email_responsavel_movimentacao,
          subject,
          message
        );
      } catch (error) {
        console.error(
          `Erro ao enviar email para ${email_responsavel_movimentacao}:`,
          error
        );
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

    const createChecklistItemsResult = await this.executeQuery(
      CheckListRepository.createChecklistItemsQuery(result.insertId),
      [result.insertId, result.inserId]
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
      reprovado,
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
        reprovado,
        id_checklist_movimentacao,
      ]
    );
    if (reprovado) {
      await this.sendUnaprovedChecklistEmail(id_checklist_movimentacao);
    }
    return result.affectedRows;
  }

  static async updateChecklistItems(checklistItems) {
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

  static async getChecklistItems(
    id_patrimonio,
    id_movimentacao,
    id_checklist_movimentacao
  ) {
    const checklistItems = await this.executeQuery(
      CheckListRepository.getChecklistItemsQuery(),
      [id_checklist_movimentacao]
    );
    return checklistItems;
  }

  static async getChecklistNotifications(CODPESSOA, status) {
    const notifications = await this.executeQuery(
      CheckListRepository.getChecklistNotificationsQuery(),
      [CODPESSOA, CODPESSOA]
    );
    for (let checklist of notifications) {
      let createdDate = new Date(checklist.data_criacao);
      const today = new Date();
      const threeDaysAgo = new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000);
      if (createdDate < threeDaysAgo && !checklist.realizado) {
        checklist.atrasado = 1;
      }
    }
    if(status === 'atrasados'){ 
      return notifications.filter(n => n.atrasado === 1 && !n.realizado);
    }
    if(status === 'aprovar'){ 
      return notifications.filter(n => n.realizado && !n.aprovado);
    }
    if(status === 'problemas'){ 
      return notifications.filter(n => n.problema);
    }
    return notifications;
  }

  static async getChecklistByPatrimonyId(id_patrimonio) {
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
