const OpportunityRepository = require("../repositories/OpportunityRepository");
const pool = require("../database");
const ProjectService = require("./ProjectService");
const fireBaseService = require("./fireBaseService");
const utils = require("../utils");

class OpportunityService {
  
  static getOpportunityById = async (oppId) => {
    const [opp] = await this.executeQuery(
      OpportunityRepository.getOppByIdQuery(),
      [oppId]
    );
    const { files } = opp;
    return opp;
  };

  static getOpportunityFiles = async (oppId) => {
    //get the files from db
    const oppFiles = await this.executeQuery(
      OpportunityRepository.getOppFilesQuery(),
      [oppId]
    );
    return oppFiles;
  };

  static createOpportunityFiles = async (oppId, files) => {
    await Promise.all(
      files.map(async (file) => {
        await fireBaseService.uploadFileToFireBase(file.path);
        const createdFile = await fireBaseService.getFileByName(file.filename);
        await createdFile.makePublic();
        const fileUrl = createdFile ? createdFile.publicUrl() : null;
        if (fileUrl) {
          const result = await this.executeQuery(
            OpportunityRepository.createOppFileQuery(),
            [oppId, file.filename, fileUrl]
          );
          utils.removeFile(file.path);
          return result.insertId;
        }
      })
    );
  };

  static createOpportunity = async (opp) => {
    const {
      codOs,
      codTipoOs,
      codCCusto,
      obra,
      dataSolicitacao,
      dataNecessidade,
      docReferencia,
      listaMateriais,
      dataInicio,
      dataPrevEntrega,
      dataEntrega,
      codStatus,
      nome,
      descricao,
      atividades,
      prioridade,
      solicitante,
      responsavel,
      codDisciplina,
      gut,
      gravidade,
      urgencia,
      tendencia,
      dataLiberacao,
      relacionamento,
      fkCodCliente,
      fkCodColigada,
      valorFatDireto,
      valorServicoMO,
      valorServicoMatAplicado,
      valorMaterial,
      valorTotal,
      codSegmento,
      codCidade,
      valorLocacao,
      idAdicional,
      idProjeto,
      dataInteracao,
      valorFatDolphin,
      principal,
      valorComissao,
      idMotivoPerdido,
      observacoes,
      descricaoVenda,
      emailVendaEnviado,
      comentarios,
      seguidores,
    } = opp;
    const isAdicional = idProjeto !== 0 && idProjeto !== null && idProjeto !== undefined;
    console.log('criou adicional!');
    console.log({isAdicional, idProjeto})
    if (isAdicional) {
      const adicionalInsertResult = await this.executeQuery(
        OpportunityRepository.createAdicional(),
        [idProjeto, idProjeto]
      );
      const result = await this.executeQuery(
        OpportunityRepository.createOpportunityQuery(),
        [
          codOs,
          codTipoOs,
          codCCusto,
          obra,
          dataSolicitacao
            ? dataSolicitacao.slice(0, 19).replace("T", " ")
            : null, // Formata dataSolicitacao
          dataNecessidade
            ? dataNecessidade.slice(0, 19).replace("T", " ")
            : null, // Formata dataNecessidade
          docReferencia,
          listaMateriais,
          dataInicio ? dataInicio.slice(0, 19).replace("T", " ") : null, // Formata dataInicio
          dataPrevEntrega
            ? dataPrevEntrega.slice(0, 19).replace("T", " ")
            : null, // Formata dataPrevEntrega
          dataEntrega ? dataEntrega.slice(0, 19).replace("T", " ") : null, // Formata dataEntrega
          codStatus,
          nome,
          descricao,
          atividades,
          prioridade,
          solicitante,
          responsavel,
          codDisciplina,
          gut,
          gravidade,
          urgencia,
          tendencia,
          dataLiberacao ? dataLiberacao.slice(0, 19).replace("T", " ") : null, // Formata dataLiberacao
          relacionamento,
          fkCodCliente,
          fkCodColigada,
          valorFatDireto,
          valorServicoMO,
          valorServicoMatAplicado,
          valorMaterial,
          valorTotal,
          codSegmento,
          codCidade,
          valorLocacao,
          adicionalInsertResult.insertId,
          idProjeto,
          dataInteracao, // Presumindo que dataInteracao já está em formato correto ou não precisa de alteração
          valorFatDolphin,
          principal,
          valorComissao,
          idMotivoPerdido,
          observacoes,
          descricaoVenda,
          emailVendaEnviado,
        ]
      );
      const [adicional] = await this.executeQuery(
        `SELECT * FROM ADICIONAIS WHERE ID = ?`,
        [adicionalInsertResult.insertId]
      );
      console.log({
        adicional,
        codOs: result.insertId,
      })
      return {
        adicional,
        codOs: result.insertId,
      };
    }

    const newProjectId = await ProjectService.createProject({
      descricao: nome,
    });
    const adicionalInsertResult = await this.executeQuery(
      OpportunityRepository.createAdicional(),
      [newProjectId, newProjectId]
    );
    const result = await this.executeQuery(
      OpportunityRepository.createOpportunityQuery(),
      [
        codOs,
        codTipoOs,
        codCCusto,
        obra,
        dataSolicitacao ? dataSolicitacao.slice(0, 19).replace("T", " ") : null, // Formata dataSolicitacao
        dataNecessidade ? dataNecessidade.slice(0, 19).replace("T", " ") : null, // Formata dataNecessidade
        docReferencia,
        listaMateriais,
        dataInicio ? dataInicio.slice(0, 19).replace("T", " ") : null, // Formata dataInicio
        dataPrevEntrega ? dataPrevEntrega.slice(0, 19).replace("T", " ") : null, // Formata dataPrevEntrega
        dataEntrega ? dataEntrega.slice(0, 19).replace("T", " ") : null, // Formata dataEntrega
        codStatus,
        nome,
        descricao,
        atividades,
        prioridade,
        solicitante,
        responsavel,
        codDisciplina,
        gut,
        gravidade,
        urgencia,
        tendencia,
        dataLiberacao ? dataLiberacao.slice(0, 19).replace("T", " ") : null, // Formata dataLiberacao
        relacionamento,
        fkCodCliente,
        fkCodColigada,
        valorFatDireto,
        valorServicoMO,
        valorServicoMatAplicado,
        valorMaterial,
        valorTotal,
        codSegmento,
        codCidade,
        valorLocacao,
        adicionalInsertResult.insertId,
        isAdicional ? idProjeto : newProjectId,
        dataInteracao, // Presumindo que dataInteracao já está em formato correto ou não precisa de alteração
        valorFatDolphin,
        principal,
        valorComissao,
        idMotivoPerdido,
        observacoes,
        descricaoVenda,
        emailVendaEnviado,
      ]
    );
    await this.handleComments(comentarios, result.insertId);
    await this.handleFollowers(seguidores, newProjectId);
    return {
      idAdicional: 0,
      codOs: result.insertId,
    };
  };

  static handleFollowers = async (seguidores, projectId) => {
    if (seguidores && seguidores.length) {
      const followersToBeInserted = await this.filterValidUsersTobeInserted(
        seguidores,
        projectId
      );

      if (followersToBeInserted && followersToBeInserted.length) {
        await Promise.all(
          followersToBeInserted.map(async (follower) =>
            this.executeQuery(OpportunityRepository.createFollowerQuery(), [
              follower.id_seguidor_projeto,
              follower.id_projeto,
              follower.codpessoa,
              follower.ativo,
            ])
          )
        );
      }
    }
    const newFollowersCodPessoalist = seguidores
      .map((seguidor) => seguidor.codpessoa)
      .join(",");
    if (newFollowersCodPessoalist && newFollowersCodPessoalist.length) {
      const deleteResult = await this.executeQuery(
        OpportunityRepository.deleteFollowersByProjectIdQuery(
          newFollowersCodPessoalist
        ),
        [projectId]
      );
    } else {
      const deleteResult = await this.executeQuery(
        OpportunityRepository.deleteAllfollowersByProjectId(),
        [projectId]
      );
    }
  };

  static filterValidUsersTobeInserted = async (seguidores, projectId) => {
    const databaseFollowersList = await this.executeQuery(
      OpportunityRepository.getAllFollowers()
    );
    return seguidores
      .map((newFollower) => ({
        ...newFollower,
        id_projeto: projectId,
      }))
      .filter((newFollower) => newFollower.id_seguidor_projeto === 0)
      .filter(
        (newFollower) =>
          !databaseFollowersList.find(
            (followerOnDb) =>
              followerOnDb.id_projeto === newFollower.id_projeto &&
              followerOnDb.codpessoa === newFollower.codpessoa
          )
      );
  };

  static updateOpportunity = async (opp) => {
    console.log('updateOpportunity')
    const {
      codOs,
      codTipoOs,
      codCCusto,
      obra,
      dataSolicitacao,
      dataNecessidade,
      docReferencia,
      listaMateriais,
      dataInicio,
      dataPrevEntrega,
      dataEntrega,
      codStatus,
      nome,
      descricao,
      atividades,
      prioridade,
      solicitante,
      responsavel,
      codDisciplina,
      gut,
      gravidade,
      urgencia,
      tendencia,
      dataLiberacao,
      relacionamento,
      fkCodCliente,
      fkCodColigada,
      valorFatDireto,
      valorServicoMO,
      valorServicoMatAplicado,
      valorMaterial,
      valorTotal,
      codSegmento,
      codCidade,
      valorLocacao,
      idAdicional,
      idProjeto,
      dataInteracao,
      valorFatDolphin,
      principal,
      valorComissao,
      idMotivoPerdido,
      observacoes,
      descricaoVenda,
      emailVendaEnviado,
      comentarios,
      seguidores,
      files,
    } = opp;
    const affectedRows = await this.executeQuery(
      OpportunityRepository.updateOpportunityQuery(),
      [
        codTipoOs,
        codCCusto,
        obra,
        dataSolicitacao ? dataSolicitacao.slice(0, 19).replace("T", " ") : null, // Formata dataSolicitacao
        dataNecessidade ? dataNecessidade.slice(0, 19).replace("T", " ") : null, // Formata dataNecessidade
        docReferencia,
        listaMateriais,
        dataInicio ? dataInicio.slice(0, 19).replace("T", " ") : null, // Formata dataInicio
        dataPrevEntrega ? dataPrevEntrega.slice(0, 19).replace("T", " ") : null, // Formata dataPrevEntrega
        dataEntrega ? dataEntrega.slice(0, 19).replace("T", " ") : null, // Formata dataEntrega
        codStatus,
        nome,
        descricao,
        atividades,
        prioridade,
        solicitante,
        responsavel,
        codDisciplina,
        gut,
        gravidade,
        urgencia,
        tendencia,
        dataLiberacao ? dataLiberacao.slice(0, 19).replace("T", " ") : null, // Formata dataLiberacao
        relacionamento,
        fkCodCliente,
        fkCodColigada,
        valorFatDireto,
        valorServicoMO,
        valorServicoMatAplicado,
        valorMaterial,
        valorTotal,
        codSegmento,
        codCidade,
        valorLocacao,
        idAdicional,
        idProjeto,
        dataInteracao, // Presumindo que dataInteracao já está em formato correto ou não precisa de alteração
        valorFatDolphin,
        principal,
        valorComissao,
        idMotivoPerdido,
        observacoes,
        descricaoVenda,
        emailVendaEnviado,
        codOs,
      ]
    );
    
    await this.handleFiles(files, codOs);
    await this.handleComments(comentarios, codOs);
    await this.handleFollowers(seguidores, idProjeto);
    return { codOs: opp.codOs };
  };

  static handleFiles = async (filesReceived, oppId) => {
    console.log('handleFiles');
    const oppFiles = await this.executeQuery(
      OpportunityRepository.getOppFilesQuery(),
      [oppId]
    );
    if (oppFiles.length) {
      const filesToDelete = oppFiles.filter(
        (oppFile) =>
          !filesReceived.find(
            (fileReceived) => fileReceived.id_anexo_os === oppFile.id_anexo_os
          )
      );
      console.log({ filesToDelete_length: filesToDelete.length})
      if(filesToDelete.length) {
          const idsToDeleteString = `(${filesToDelete
            .map((file) => file.id_anexo_os) // Extrai o id_anexo_os de cada item
            .join(",")})`;

          await this.executeQuery(
            OpportunityRepository.deleteOppFilesQuery(idsToDeleteString)
          );
      }
    }
  };

  static getOppStatusList = async () => {
    const statusList = await this.executeQuery(
      OpportunityRepository.getOppStatusListQuery()
    );
    return statusList;
  };

  static handleComments = async (comentarios, opportunityId) => {
    console.log("handleComments");
    console.log({comentarios});
    if (comentarios && comentarios.length) {
      const commentsToInsert = comentarios
        .filter((comment) => comment.codigoComentario < 1) // Filtra os comentários sem `codigoComentario`
        .map((comment) => ({
          ...comment,
          codOs: opportunityId,
        }));
      const commentsToUpdate = comentarios.filter(
        (comment) => comment.codigoComentario
      );

      console.log({ commentsToUpdate })
      if (commentsToUpdate.length) {
        await Promise.all(
          commentsToUpdate.map(async (comment) => {
            const resultUpdate = await this.executeQuery(
              OpportunityRepository.updateCommentQuery(),
              [comment.descricao, comment.codigoComentario]
            );
          })
        );
      }
      if (commentsToInsert.length) {
        await Promise.all(
          commentsToInsert.map(async (comment) => {
            const resultInsert = await this.executeQuery(
              OpportunityRepository.insertCommentQuery(),
              [
                0,
                comment.codOs,
                comment.descricao,
                comment.criadoEm.slice(0, 19).replace("T", " "),
                comment.criadoPor,
                0,
              ]
            );
          })
        );
      }
    }
  };

  static getOpportunities = async (params) => {
    const { finished, dateFilters, codpessoa } = params;
    const action = finished === "true" ? 1 : 0;
    const [opps] = await this.executeQuery(
      OpportunityRepository.getOpportunitiesQuery(dateFilters, action),
      [codpessoa, codpessoa, codpessoa]
    );
    return opps;
  };

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

module.exports = OpportunityService;
