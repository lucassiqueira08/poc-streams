# poc-streams
O intuito dessa poc é apresentar uma alternativa ao abordar um problema de alto consumo de memória ao gerar arquivos massivos, a estratégia utilizada foi realizar processamento via node streams.

Ambas as implementações estão rodando com um limite de 1,5GB de memoria e ambas deveriam processar 7,8 milhões de registros em uma base de dados de teste, toda a stack foi reduzida e o código original preservado para analisar apenas o consumo de memoria em ambos os casos.

A implementação que apresenta o problema de consumo de memória não conseguiu carregar todos os dados fazendo com que a query quebrasse ao rodar, portanto foi colocado um limit de 1,5 milhões de registros para que ainda sim se compare a utilização de memoria. Foi necessário quebrar os arquivos para que nao desse heap overflow e no momento de gerar o arquivo, foi utilizado toda a memoria disponível.


**Implementação atual (1,5 milhões de registros)**

* EXEC: 53.380s (m:ss.mmm)
* 1500003 lines (2 arquivos) 
* Tamanho arquivos: 483MB
* Memoria media: 929.22MB (Picos de 1,5GB)

```
> wc -l 070PGME-2023-02-15-TEST-10566133861-001.rem 
1000002 070PGME-2023-02-15-TEST-10566133861-001.rem

> wc -l 070PGME-2023-02-15-TEST-20103877164-001.rem 
500003 070PGME-2023-02-15-TEST-20103877164-001.rem
```

A implementação com node streams levou bem mais tempo para finalizar, porem apresentou um consumo de memoria constante e cadenciado sem picos de utilização e conseguiu gerar o arquivo com os 7,8 milhões de registos 


**Implementação streams (7,8 milhões de registros)**

* 7832547 lines
* EXEC: 6:11.816 (m:ss.mmm)
* Tamanho arquivo: 2,5GB
* Memoria media: 505MB (Constante)

```
> wc -l STREAM-0070PGME-2023-02-15-TEST-60730728143-001.rem
7832548 STREAM-0070PGME-2023-02-15-TEST-60730728143-001.rem
```

