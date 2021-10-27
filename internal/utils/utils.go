package utils

import (
	"bufio"
	"encoding/csv"
	"os"
)

func AssignClassesFromCsv(classByFilename map[string]string, projectNo string) error {
	file, err := os.Open(`./dataset/` + projectNo + `.csv`)
	println(projectNo, `./dataset/`+projectNo+`.csv`, file, err)
	if err != nil {
		return err
	}
	reader := csv.NewReader(bufio.NewReader(file))
	rows, _ := reader.ReadAll()
	for _, row := range rows {
		filename := row[4]
		class := row[6]
		classByFilename[filename] = class
	}
	return nil
}
