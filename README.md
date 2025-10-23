EquipamentCheck

Controle de Entrada, Consulta e Baixa de Equipamentos

Aplicação web full‑stack em Node.js/Express e SQLite, com frontend em HTML/CSS/JavaScript, que implementa:

📋 Checklist de Funcionalidades

Registro de equipamentos com campos:
*Nome do Responsável*
*Tipo de Equipamento (select dinâmico)*
*Modelo, Fabricante e Serial (aparecem após escolha do tipo)*
*Upload de foto do equipamento*

Geração automática de TAGID único (prefixo + sequência 3 dígitos):
*Rota GET /next-tag/:tipo → retorna { tagid: 'NB001' }*
*Front-end chama essa rota e pré‑enche o campo Tag ID (somente visualização)*
*Back-end ignora tagid no payload e gera internamente, garantindo unicidade*

Persistência no banco SQLite (equipamentos.db), tabela equipamentos:

API REST:

 registra novo equipamento (gera tagid se não enviado)*
 consulta equipamento ativo (filtra ativo = 1)*
 marca como baixa (status='Baixa' e ativo=0)*

Interface de Consulta com abas:

*Manual: pesquisa via input de Tag ID*
*QR Code: leitura por câmera*


Gerador pós-consulta:
*QR Code (QRious)*

Baixa de Equipamento:
*Botão na tela de consulta que chama PATCH /equipamentos/:tagid/baixa*
*Feedback via SweetAlert2*

Tratamento de erros e Loading Spinner no envio:
*Erros de UNIQUE constraint mapeados para alertas customizados*
*Spinner no botão “Registrar Entrada” até resposta do servidor*

🚀 Iniciando Localmente

git clone https://github.com/Lukas401/EquipamentCheck.git
cd EquipamentCheck
npm install
npm start

🔧 Ambiente e Deploy

SQLite local para testes. Em produção, migrar para SQL Server ou PostgreSQL.

Deploy Irei finalizar. Por enquanto no: Render.com 

📌 Futuras Evoluções

Migração para SQL Server 

Autenticação e autorização de usuários

Dashboard de relatórios de ativos e baixados

Integração com Power Apps / Power Automate

Logs e auditoria de operações
