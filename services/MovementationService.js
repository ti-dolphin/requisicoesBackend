const MovementationRepository = require("../repositories/MovementationRepository");
const pool = require("../database");
const fireBaseService = require("./fireBaseService");

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
    const localeDate = new Date().toLocaleString("sv-SE", opcoes).replace("T", " ");
    const id_ultima_movimentacao = await this.getLastMovementationByPatrimonyId(
      id_patrimonio
    );
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
    return result.insertId;
  }

  static async getMovementationsByPatrimonyId(patrimonyId) {
    const result = await this.executeQuery(
      MovementationRepository.getMovementationsByPatrimonyId_Query(),
      [patrimonyId]
    );
    console.log("\ngetMovementationsByPatrimonyId - result\n", result );
    return result;
  }

  static async getLastMovementationByPatrimonyId(patrimonyId) {
    const result = await this.executeQuery(
      MovementationRepository.getLastMovementationQuery(patrimonyId)
    );
    if (result && result[0]) return result.id_movimentacao;
    else return 0;
  }

  static async deleteMovementation(movementationId){ 
    const result = await this.executeQuery(
      MovementationRepository.deleteMovementationQuery(),
      [movementationId]
    );
    return result.affectedRows;
  }

  static async deleteMovementationFile(movementationFileid) {
    const result = await this.executeQuery(
      MovementationRepository.deleteMovementationFileQuery(),
      [movementationFileid]
    );

    console.log("result deleteMovementationFile \n", result);
    return result.affectedRows;
  }

  static async executeQuery(query, params) {
    console.log("params: ", params);
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
