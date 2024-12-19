## FAQ (projeto NM)

# básico

- **nrPedido**: campo "DocNum" da tabela de pedidos
- **cdAdquirente**: usa-se como "1" se o cliente for trabalhar somente com a CIELO sim
- **nrNSU:** NSU é retornado pela CIELO
- **Antes de executar este ENDPOINT** *precisamos da quantidade de parcelas da venda*
- **Antes de executar este ENDPOINT** deve ter um array que indica se o cliente está pagando com mais de um cartão


```json
{
"nrPedido": "169", 
"cdCliente": "C00021",
"vlPedido": 1.00,
"pagamentos": [
{
"cdAdquirente": "1", 
"vlPagamento": 40,
"qtParcelas": 1,
"nrNSU": "123456"
},
{
"cdAdquirente": "1",
"vlPagamento": 60,
"qtParcelas": 2,
"nrNSU": "123457"
}
]
}
```
