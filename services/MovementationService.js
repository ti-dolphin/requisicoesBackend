const MovementationRepository = require("../repositories/MovementationRepository");
const ChecklistRepository = require('../repositories/CheckListRepository');
const pool = require("../database");
const fireBaseService = require("./fireBaseService");
const CheckListService = require("./CheckListService");

const opcoes = {
  timeZone: "America/Sao_Paulo",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
};

class MovementationService {
  static getMovementationsByPatrimonyId = async (patrimonyId) => {
    const [result] = await this.executeQuery(
      MovementationRepository.getMovementationsByPatrimonyId_Query(),
      [patrimonyId]
    );
    if (result.length > 0) return result;
  };

  static async acceptMovementation(movementationId) {
    const affectedRows = await this.executeQuery(
      MovementationRepository.acceptMovementationQuery(),
      [movementationId]
    );
    return affectedRows;
  }
  
  static async getMovementationFiles(movementationId) {
    const result = await this.executeQuery(
      MovementationRepository.getMovementationFilesQuery(),
      [movementationId]
    );
    return result;
  }

  static async updateMovementation(movementation) {
    const {
      id_movimentacao,
      data,
      id_patrimonio,
      id_projeto,
      id_responsavel,
      id_ultima_movimentacao,
      observacao,
    } = movementation;
    const result = await this.executeQuery(
      MovementationRepository.updateMovementationQuery(),
      [
        data.split("T")[0],
        id_patrimonio,
        id_projeto,
        id_responsavel,
        id_ultima_movimentacao,
        observacao,
        id_movimentacao,
      ]
    );
    if (result) return result.affectedRows;
  }

  static async createMovementationFile(movementationId, file) {
    const { path, filename } = file;
    const fileUrl = await this.getFileUrl(path, filename);
    console.log("fileInfo: ", {
      path,
      filename,
    });
    console.log("filerUrl: ", fileUrl);
    console.log("idMovementation: ", movementationId);
    const result = await this.executeQuery(
      MovementationRepository.createMovementationFileQuery(),
      [fileUrl, filename, movementationId]
    );
    return result.insertId;
  }

  static async getFileUrl(path, filename) {
    await fireBaseService.uploadFileToFireBase(path);
    const [allFiles] = await fireBaseService.getFilesFromFirebase();
    const createdFile = allFiles.find((item) => item.name === filename);
    return createdFile.publicUrl();
  }

  static async createMovementation(movementation) {
    const { id_projeto, data, id_responsavel, observacao, id_patrimonio } =
      movementation;
    const localeDate = new Date()
      .toLocaleString("sv-SE", opcoes)
      .replace("T", " ");
    const id_ultima_movimentacao = await this.getLastMovementationByPatrimonyId(
      id_patrimonio
    );
     console.log("LOCALE DATE: ", localeDate);
     const result = await this.executeQuery(
       MovementationRepository.createMovementationQuery(),
       [
         localeDate,
         id_patrimonio,
         id_projeto,
         id_responsavel,
         observacao,
         id_ultima_movimentacao,
       ]
     );
     if (!id_ultima_movimentacao) {
       await this.executeQuery(
         MovementationRepository.setLastMovementationIdQuery(),
         [result.insertId, result.insertId]
       );
     }
     await CheckListService.createChecklist({
       id_movimentacao: result.insertId,
       data_criacao: new Date().toISOString().replace("T", " ").split(".")[0],
       realizado: 0,
       data_realizado: null,
       aprovado: 0,
       data_aprovado: null,
       observacao: null,
     });
    return result.insertId;
  }

  static async getLastMovementationByPatrimonyId(patrimonyId) {
      
    const result = await this.executeQuery(
      MovementationRepository.getLastMovementationQuery(patrimonyId)
    );
    console.log("result: ", result);
    if (result && result[0]) return result[0].id_movimentacao;
    else return 0;
  }

  static async deleteMovementation(movementationId, patrimonyId) {
  
    const [result] = await this.executeQuery(
      MovementationRepository.getMaxIdQuery(),
      [patrimonyId]
    );
    console.log("result.max_id", result.max_id);
    console.log("movementationId: ", movementationId);
    if (result.max_id == movementationId){ 
          const result = await this.executeQuery(
          MovementationRepository.deleteMovementationQuery(),
          [movementationId]
        );
         console.log("result affectedRows", result.affectedRows);
         return result.affectedRows;
    }
        throw new Error("Só é possível deletar a ultima movimentação!");
  }

  static async deleteMovementationFile(movementationFileid, filename) {
    const result = await this.executeQuery(
      MovementationRepository.deleteMovementationFileQuery(),
      [movementationFileid]
    );
    await fireBaseService.deleteFileByName(filename);
    console.log("result deleteMovementationFile \n", result);
    return result.affectedRows;
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
module.exports = MovementationService;
