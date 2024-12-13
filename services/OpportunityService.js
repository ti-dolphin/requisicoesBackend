const OpportunityRepository = require('../repositories/OpportunityRepository');
const pool = require("../database");
const ProjectService = require('./ProjectService');

class OpportunityService {
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
      } = opp;
      const isAdicional = idProjeto !== 0 && idProjeto !== null && idProjeto !== undefined;
      console.log("isAdicional: ", isAdicional);
        if(isAdicional){ 
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
                  dataEntrega
                    ? dataEntrega.slice(0, 19).replace("T", " ")
                    : null, // Formata dataEntrega
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
                  dataLiberacao
                    ? dataLiberacao.slice(0, 19).replace("T", " ")
                    : null, // Formata dataLiberacao
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
              return result.insertId;
       }
        const newProjectId = await ProjectService.createProject({ descricao });
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
           dataSolicitacao
             ? dataSolicitacao.slice(0, 19).replace("T", " ")
             : null, // Formata dataSolicitacao
           dataNecessidade
             ? dataNecessidade.slice(0, 19).replace("T", " ")
             : null, // Formata dataNecessidade
           docReferencia,
           listaMateriais,
           dataInicio
             ? dataInicio.slice(0, 19).replace("T", " ")
             : null, // Formata dataInicio
           dataPrevEntrega
             ? dataPrevEntrega.slice(0, 19).replace("T", " ")
             : null, // Formata dataPrevEntrega
           dataEntrega
             ? dataEntrega.slice(0, 19).replace("T", " ")
             : null, // Formata dataEntrega
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
           dataLiberacao
             ? dataLiberacao.slice(0, 19).replace("T", " ")
             : null, // Formata dataLiberacao
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
       return result.insertId;

  }

  static getOppStatusList = async () => {
    const statusList = await this.executeQuery(
      OpportunityRepository.getOppStatusListQuery()
    );
    return statusList;
  };

  static getOpportunities = async (params) => {
    const { finished, dateFilters } = params;
    const action = finished === "true" ? 1 : 0;
    const opps = await this.executeQuery(
      OpportunityRepository.getOpportunitiesQuery(dateFilters),
      [action]
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