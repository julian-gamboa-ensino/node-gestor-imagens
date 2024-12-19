# Aula Prática: Transformando o Monolito de Tagueamento de Fotos em Microsserviços

Este README descreve os passos para transformar o aplicativo monolítico de tagueamento de fotos em uma arquitetura de microsserviços. O monolito atual possui as seguintes funcionalidades principais: listagem de fotos, tagueamento, adição de múltiplas tags e exibição de arquivos.

## Motivação para a Transformação

A arquitetura monolítica apresenta limitações à medida que o aplicativo cresce. A transformação em microsserviços visa:

* **Escalabilidade:** Permitir o escalonamento independente de cada serviço, como o serviço de tagueamento, que pode exigir mais recursos que o serviço de listagem de fotos.
* **Resiliência:** Isolar falhas. A indisponibilidade de um serviço, como o de adição de tags, não impactará outros serviços, como a listagem de fotos.
* **Flexibilidade Tecnológica:** Permitir o uso de diferentes tecnologias para cada microsserviço, de acordo com suas necessidades específicas.
* **Deploy Independente:** Facilitar o deploy e a atualização de cada serviço individualmente, sem afetar todo o sistema.

## Arquitetura Proposta

A arquitetura de microsserviços proposta divide o monolito em três serviços principais:

1. **Serviço de Gerenciamento de Fotos:** Responsável por listar as fotos disponíveis, armazenar os metadados das fotos e gerenciar seu ciclo de vida.
2. **Serviço de Tagueamento:** Responsável por gerenciar as tags, associar tags às fotos e processar as solicitações de adição e remoção de tags.
3. **Serviço de Conteúdo:** Responsável por servir o conteúdo estático, como as próprias imagens e outros arquivos relacionados.

## Passos para a Transformação

1. **Decomposição do Código:** Separar o código do monolito em três projetos independentes, cada um correspondente a um microsserviço.

2. **Escolha da Tecnologia:** Avaliar e selecionar a tecnologia mais adequada para cada microsserviço.  Considerar Node.js com Express para manter a consistência, ou explorar outras opções como Python com Flask/Django ou Go.

3. **Comunicação entre Serviços:** Implementar a comunicação entre os serviços utilizando um mecanismo leve, como uma fila de mensagens (RabbitMQ, Kafka) ou chamadas HTTP síncronas/assíncronas. Para este exemplo, recomendamos explorar comunicação HTTP RESTful.

4. **Persistência de Dados:** Substituir o armazenamento em arquivos de texto por um banco de dados mais robusto.  Avaliar opções como PostgreSQL, MySQL, MongoDB ou soluções cloud-native como Cloud SQL ou Cloud Spanner. Cada microsserviço pode ter seu próprio banco de dados, promovendo o isolamento e a escalabilidade.

5. **API Gateway:** Implementar um API Gateway para gerenciar as requisições externas, roteando-as para os microsserviços apropriados.  Isto simplifica o acesso aos serviços e permite a implementação de políticas de segurança e monitoramento centralizadas.  Kong ou Apigee são boas opções.

6. **Descoberta de Serviços:** Implementar um mecanismo de descoberta de serviços para permitir que os microsserviços se encontrem dinamicamente.  Consul, etcd ou Eureka são alternativas.  Para cenários mais simples com orquitetura serverless, variáveis de ambiente podem ser sufficiantes.

7. **Monitoramento e Logging:** Implementar um sistema de monitoramento centralizado (Prometheus, Grafana) e logging (ELK stack, Cloud Logging) para rastrear o desempenho e identificar problemas nos microsserviços.

8. **Deploy:**  Configurar um pipeline de CI/CD para automatizar o deploy de cada microsserviço de forma independente.  Docker e Kubernetes são ferramentas essenciais para facilitar o deploy e o gerenciamento dos containers.


## Exemplo de Implementação (Comunicação HTTP)

O serviço de Tagueamento pode expor um endpoint RESTful para adicionar tags a uma foto:

