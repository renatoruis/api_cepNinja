#!/bin/bash

if [ -n "$WAIT_FOR_HOSTS" ]; then

    hosts=$(echo $WAIT_FOR_HOSTS | tr ";" "\n")

    for addr in $hosts
    do
        echo "Host => [$addr]"
    done

    for addr in $hosts
    do
        ip_and_port=$(echo $addr | tr ":" " ")
        until nc -z $ip_and_port
        do
            echo "Esperando serviço.. [$ip_and_port]"
            sleep 1
        done 2> /dev/null
    done

fi 

npm start