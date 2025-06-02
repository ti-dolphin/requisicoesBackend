 class ProductRepository {
  static searchProductsQuery(typeId) { 
     if (Number(typeId) !== 0) {
       const query = `
    SELECT 
          ID, codigo, nome_fantasia, produtos.familia
      FROM 
          produtos 
      INNER JOIN
          web_familia_tipo 
          ON web_familia_tipo.familia = produtos.familia
      INNER JOIN 
          web_tipo_requisicao
          ON web_tipo_requisicao.id_tipo_requisicao = web_familia_tipo.id_tipo_requisicao
      WHERE 
          web_tipo_requisicao.id_tipo_requisicao = ? 
          AND nome_fantasia LIKE ? 
          AND inativo = 0 
          AND ultimo_nivel = 0
      ORDER BY 
          nome_fantasia ASC
    `;
       return query;
     }
    const query = `
       SELECT 
          ID, codigo, nome_fantasia, produtos.familia
      FROM 
          produtos 
        WHERE 
            nome_fantasia LIKE ? 
            AND inativo = 0 
            AND ultimo_nivel = 0
      ORDER BY 
          nome_fantasia ASC
    `;
   return query;
  }
}
module.exports = ProductRepository;