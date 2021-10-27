package server

import (
	"net/http"
	"regexp"

	"github.com/gin-gonic/gin"
	"github.com/tnraro/suite-helper/internal/utils"
)

func Init() {
	classByFilename := make(map[string]string)
	projectCache := make(map[string]struct{})

	vaildateProjectNoRegexp, _ := regexp.Compile(`\d+_(\d+)\.`)

	router := NewRouter()

	router.GET("/classes/:filename", func(c *gin.Context) {
		filename := c.Param("filename")
		projectNo := vaildateProjectNoRegexp.FindStringSubmatch(filename)[1]
		if _, ok := projectCache[projectNo]; !ok {
			err := utils.AssignClassesFromCsv(classByFilename, projectNo)
			println(err)
			if err != nil {
				c.AbortWithStatus(http.StatusNotFound)
			}
		}
		if classes, ok := classByFilename[filename]; ok {
			c.JSON(http.StatusOK, classes)
		} else {
			c.AbortWithStatus(http.StatusNotFound)
		}
	})

	router.Run()
}
