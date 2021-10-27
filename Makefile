BIN := alba
PKG := github.com/tnraro/suite-helper

run:
	go run $(PKG)/cmd/$(BIN)

build:
	go build -o bin/$(BIN) $(PKG)/cmd/$(BIN)