 ; QEWD Interface to mgsql
ping() ;
 s ^rob("ping")=$h
 QUIT "pong"
 ;
sqlquery(sql) ;
 n %zi,%zo
 s ^rob(1)=sql
 s ok=$$exec^%mgsql("",sql,.%zi,.%zo)
 s ^rob(2)=ok
 QUIT ok
 ;
