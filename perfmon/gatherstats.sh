#%user,%nice,%system,%iowait,%steal,%idle
SARINFO=`sar 1 5 | grep "^Average" | sed "s/ * /,/g" | cut -f3- -d','`
USERINFO=`echo $SARINFO | cut -f1 -d','`
SYSINFO=`echo $SARINFO | cut -f3 -d','`
IOWINFO=`echo $SARINFO | cut -f4 -d','`
IDLINFO=`echo $SARINFO | cut -f6 -d','`
echo "{"
echo "\"CPU\" : { \"USER\":"$USERINFO", \"SYS\":"$SYSINFO", \"IOWAIT\":"$IOWINFO", \"IDLE\":"$IDLINFO" }"
#PID,%CPU,COMMAND
CPUPROCS=`export SORT=%cpu;ps -eo pid,$SORT,comm,cmd --sort=-"$SORT" | sed "s/ * /,/g;s/^,//g" | head -10 | tail -9`
echo ", \"CPUPROCS\" : [ "
LINEZ=0
for i in $CPUPROCS
do
LINEZ=`expr $LINEZ + 1`
PID=`echo $i | cut -f1 -d','`
CPU=`echo $i | cut -f2 -d','`
CMD=`echo $i | cut -f3 -d','`
COMM=`echo $i | cut -f4- -d',' | sed "s/,/ /g"`
[ $LINEZ -gt 1 ]&&echo ","
echo "{ \"PID\" : $PID, \"CPU\" : $CPU, \"CMD\" : \"$CMD\", \"COMMANDLINE\" : \"$COMM\" }"
done
echo "]"
MEMPROCS=`export SORT=%mem;ps -eo pid,$SORT,cmd --sort=-"$SORT" | sed "s/ * /,/g;s/^,//g" | head -10 | tail -9`
echo ", \"MEMPROCS\" : [ "
LINEZ=0
for i in $MEMPROCS
do
LINEZ=`expr $LINEZ + 1`
PID=`echo $i | cut -f1 -d','`
MEM=`echo $i | cut -f2 -d','`
CMD=`echo $i | cut -f3 -d','`
[ $LINEZ -gt 1 ]&&echo ","
echo "{ \"PID\" : $PID, \"MEM\" : $MEM, \"CMD\" : \"$CMD\" }"
done
echo "]"
echo "}"
