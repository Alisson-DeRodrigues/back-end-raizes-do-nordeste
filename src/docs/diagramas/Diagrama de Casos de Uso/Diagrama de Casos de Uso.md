@startuml
left to right direction
skinparam packageStyle rectangle

' Atores Principais (Humanos)
actor "Cliente" as cli
actor "Atendente" as ate
actor "Cozinha" as coz
actor "Gerente / Administrador" as adm

' Ator Secundário (Sistema Externo)
actor "Gateway de Pagamento" as gtw_pag

rectangle "Casos de Uso - Raízes do Nordeste" {
    
    ' Casos de Uso do Cliente
    cli --> (Realizar Pedido - UC01)
    cli --> (Fazer Pagamento - UC02)
    cli --> (Resgatar Pontos - UC03)
    
    ' Casos de Uso do Atendente
    ate --> (Criar Pedido - UC04)
    ate --> (Entregar Pedido - UC05)
    
    ' Casos de Uso da Cozinha
    coz --> (Preparar Pedido - UC06)
    
    ' Casos de Uso do Gerente/Admin
    adm --> (Abastecer Estoque - UC07)
    adm --> (Criar Produto do Cardápio - UC08)
    
    ' Interação do Sistema de Pagamento Mock
    ' Ele reage/ajuda a concluir a ação de pagamento do cliente
    (Processar Pagamento - UC08) <-- gtw_pag : <<Registrar Status>>
}
@enduml