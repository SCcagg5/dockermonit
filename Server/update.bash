while [[ 1 ]]; do
  data=$(docker stats --format "{{json .}}," --no-stream -a);
  mem=$(free | grep Mem | awk '{print $3/$2 * 100.0}')
  proc=$(grep 'cpu ' /proc/stat | awk '{usage=($2+$4)*100/($2+$4+$5)} END {print usage "%"}')
  echo "{\"memory\" : $mem, \"CPU\": $proc, \"containers\":  [${data::-1}]}" > /var/www/html/index.html;
done;
