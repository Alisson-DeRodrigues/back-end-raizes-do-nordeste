-- criando franquia e unidade
INSERT INTO franquias (id, nome) VALUES ('11111111-1111-1111-1111-111111111111', 'Raízes do Nordeste');
INSERT INTO unidades (id, franquia_id, nome) VALUES ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Olívia Flores - Vitória da Conquista');

-- criando itens de estoque
-- baião de dois
INSERT INTO estoque_itens (id, unidade_id, nome, unidade_de_medida, estoque_atual, estoque_minimo)
VALUES 
  ('eeeeeeee-0000-0000-0000-000000000010', '22222222-2222-2222-2222-222222222222', 'Arroz Parboilizado', 'kg', 10.00, 2.00),
  ('eeeeeeee-0000-0000-0000-000000000011', '22222222-2222-2222-2222-222222222222', 'Feijão de Corda (Fradinho)', 'kg', 5.00, 1.00),
  ('eeeeeeee-0000-0000-0000-000000000012', '22222222-2222-2222-2222-222222222222', 'Queijo Coalho', 'kg', 3.50, 0.50),
  ('eeeeeeee-0000-0000-0000-000000000013', '22222222-2222-2222-2222-222222222222', 'Carne Seca (Charque)', 'kg', 4.00, 1.00),
  ('eeeeeeee-0000-0000-0000-000000000014', '22222222-2222-2222-2222-222222222222', 'Toucinho / Bacon', 'kg', 2.00, 0.50),
  ('eeeeeeee-0000-0000-0000-000000000015', '22222222-2222-2222-2222-222222222222', 'Manteiga de Garrafa', 'ml', 500.00, 100.00),
  ('eeeeeeee-0000-0000-0000-000000000016', '22222222-2222-2222-2222-222222222222', 'Coentro Fresco', 'g', 200.00, 50.00)
ON CONFLICT (id) DO UPDATE SET 
  estoque_atual = EXCLUDED.estoque_atual,
  estoque_minimo = EXCLUDED.estoque_minimo;

-- acarajé
INSERT INTO estoque_itens (id, unidade_id, nome, unidade_de_medida, estoque_atual, estoque_minimo)
VALUES 
  ('eeeeeeee-0000-0000-0000-000000000020', '22222222-2222-2222-2222-222222222222', 'Feijão Fradinho (Moído)', 'kg', 20.00, 5.00),
  ('eeeeeeee-0000-0000-0000-000000000021', '22222222-2222-2222-2222-222222222222', 'Azeite de Dendê', 'litro', 15.00, 3.00),
  ('eeeeeeee-0000-0000-0000-000000000022', '22222222-2222-2222-2222-222222222222', 'Camarão Seco Defumado', 'kg', 5.00, 1.00),
  ('eeeeeeee-0000-0000-0000-000000000023', '22222222-2222-2222-2222-222222222222', 'Cebola Branca', 'kg', 10.00, 2.00),
  ('eeeeeeee-0000-0000-0000-000000000024', '22222222-2222-2222-2222-222222222222', 'Farinha de Trigo (para Vatapá)', 'kg', 5.00, 1.00),
  ('eeeeeeee-0000-0000-0000-000000000025', '22222222-2222-2222-2222-222222222222', 'Leite de Coco', 'ml', 2000.00, 500.00),
  ('eeeeeeee-0000-0000-0000-000000000026', '22222222-2222-2222-2222-222222222222', 'Amendoim Torrado e Moído', 'g', 1000.00, 200.00),
  ('eeeeeeee-0000-0000-0000-000000000027', '22222222-2222-2222-2222-222222222222', 'Pimenta Malagueta', 'g', 300.00, 50.00)
ON CONFLICT (id) DO UPDATE SET 
  estoque_atual = EXCLUDED.estoque_atual,
  estoque_minimo = EXCLUDED.estoque_minimo;

-- criando produtos do cardápio
INSERT INTO produtos_cardapio (id, unidade_id, nome, descricao, preco, ativo)
VALUES 
  (
    'cccccccc-0000-0000-0000-000000000001', 
    '22222222-2222-2222-2222-222222222222', 
    'Baião de Dois Especial', 
    'Tradicional arroz com feijão de corda, queijo coalho, carne seca desfiada, bacon e um toque de manteiga de garrafa e coentro.', 
    45.90, 
    TRUE
  ),
  (
    'cccccccc-0000-0000-0000-000000000002', 
    '22222222-2222-2222-2222-222222222222', 
    'Acarajé Completo (Unidade)', 
    'Acarajé frito na hora no azeite de dendê, recheado com vatapá cremoso e camarão seco.', 
    18.50, 
    TRUE
  ),
  (
    'cccccccc-0000-0000-0000-000000000003', 
    '22222222-2222-2222-2222-222222222222', 
    'Porção de Mini Acarajés', 
    '6 unidades de mini acarajés acompanhados de potinhos individuais de vatapá e camarão.', 
    38.00, 
    TRUE
  )
ON CONFLICT (id) DO UPDATE SET 
  nome = EXCLUDED.nome,
  descricao = EXCLUDED.descricao,
  preco = EXCLUDED.preco,
  ativo = EXCLUDED.ativo;

-- criando receitas dos produtos
INSERT INTO receita_produtos (id, produto_cardapio_id, estoque_item_id, quantidade_usada)
VALUES 
  -- Vinculando ao 'Baião de Dois Especial' (id: cccccccc-0000-0000-0000-000000000001)
  
  -- 200g de Arroz Parboilizado (unidade: kg -> 0.20)
  (gen_random_uuid(), 'cccccccc-0000-0000-0000-000000000001', 'eeeeeeee-0000-0000-0000-000000000010', 0.20),
  
  -- 150g de Feijão de Corda (unidade: kg -> 0.15)
  (gen_random_uuid(), 'cccccccc-0000-0000-0000-000000000001', 'eeeeeeee-0000-0000-0000-000000000011', 0.15),
  
  -- 120g de Queijo Coalho (unidade: kg -> 0.12)
  (gen_random_uuid(), 'cccccccc-0000-0000-0000-000000000001', 'eeeeeeee-0000-0000-0000-000000000012', 0.12),
  
  -- 100g de Carne Seca (unidade: kg -> 0.10)
  (gen_random_uuid(), 'cccccccc-0000-0000-0000-000000000001', 'eeeeeeee-0000-0000-0000-000000000013', 0.10),
  
  -- 50g de Toucinho/Bacon (unidade: kg -> 0.05)
  (gen_random_uuid(), 'cccccccc-0000-0000-0000-000000000001', 'eeeeeeee-0000-0000-0000-000000000014', 0.05),
  
  -- 30ml de Manteiga de Garrafa (unidade: ml -> 30.00)
  (gen_random_uuid(), 'cccccccc-0000-0000-0000-000000000001', 'eeeeeeee-0000-0000-0000-000000000015', 30.00),
  
  -- 10g de Coentro Fresco (unidade: g -> 10.00)
  (gen_random_uuid(), 'cccccccc-0000-0000-0000-000000000001', 'eeeeeeee-0000-0000-0000-000000000016', 10.00);

INSERT INTO receita_produtos (id, produto_cardapio_id, estoque_item_id, quantidade_usada)
VALUES 
  -- Vinculando ao 'Acarajé Completo' (id: cccccccc-0000-0000-0000-000000000002)

  -- Massa: 150g de Feijão Fradinho Moído (unidade: kg -> 0.15)
  (gen_random_uuid(), 'cccccccc-0000-0000-0000-000000000002', 'eeeeeeee-0000-0000-0000-000000000020', 0.15),
  
  -- Massa: 30g de Cebola Branca para bater a massa (unidade: kg -> 0.03)
  (gen_random_uuid(), 'cccccccc-0000-0000-0000-000000000002', 'eeeeeeee-0000-0000-0000-000000000023', 0.03),
  
  -- Fritura: 80ml de Azeite de Dendê - estimativa de absorção/uso (unidade: litro -> 0.08)
  (gen_random_uuid(), 'cccccccc-0000-0000-0000-000000000002', 'eeeeeeee-0000-0000-0000-000000000021', 0.08),
  
  -- Recheio: 40g de Camarão Seco Defumado (unidade: kg -> 0.04)
  (gen_random_uuid(), 'cccccccc-0000-0000-0000-000000000002', 'eeeeeeee-0000-0000-0000-000000000022', 0.04),
  
  -- Vatapá: 50g de Farinha de Trigo (unidade: kg -> 0.05)
  (gen_random_uuid(), 'cccccccc-0000-0000-0000-000000000002', 'eeeeeeee-0000-0000-0000-000000000024', 0.05),
  
  -- Vatapá: 60ml de Leite de Coco (unidade: ml -> 60.00)
  (gen_random_uuid(), 'cccccccc-0000-0000-0000-000000000002', 'eeeeeeee-0000-0000-0000-000000000025', 60.00),
  
  -- Vatapá: 20g de Amendoim Torrado e Moído (unidade: g -> 20.00)
  (gen_random_uuid(), 'cccccccc-0000-0000-0000-000000000002', 'eeeeeeee-0000-0000-0000-000000000026', 20.00),
  
  -- Tempero: 5g de Pimenta Malagueta (unidade: g -> 5.00)
  (gen_random_uuid(), 'cccccccc-0000-0000-0000-000000000002', 'eeeeeeee-0000-0000-0000-000000000027', 5.00);