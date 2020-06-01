#!/usr/bin/env bash

SCRIPT_DIR=$(cd $(dirname $0); pwd)
CACHE_DIR=${SCRIPT_DIR}/temp
OUTPUT=${CACHE_DIR}/isj.txt.gz

rm -f ${OUTPUT}

for no in `seq -w 1000 1000 47000` ; do
  zip=${CACHE_DIR}/${no}.zip
  echo ${no}
  unzip -p ${zip} '*.[cC][sS][vV]' | iconv -f MS_KANJI -t utf8 | gzip >> ${OUTPUT}
done
