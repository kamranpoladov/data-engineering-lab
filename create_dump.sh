username=${1}
timestamp=$(date +%s)

mysqldump -u "$username" -p "a23dasc507" > ./dumps/$timestamp.sql