#####################################
time = $(shell date +"%Y-%m-%d-%H-%M-%S")
image = "alfierichou/sequelize_swagger"
imageID = docker images 'sequelize_swagger' | uniq
CERT_DIR := ./certs

build:
	@docker build -t $(image) .

clean:
	@echo "clean this docker image..."
	@docker rmi --force $(imageID)

tag:
	@echo "tag this docker image..."
	@docker tag $(image) $(image):$(time)
	@docker push $(image):latest
	@docker push $(image):$(time)

cert:
	rm -rf $(CERT_DIR)
	mkdir $(CERT_DIR)
	openssl genrsa -out $(CERT_DIR)/private.key 2048
	base64 $(CERT_DIR)/private.key
	openssl rsa -in $(CERT_DIR)/private.key -pubout -out $(CERT_DIR)/public.pem
	base64 $(CERT_DIR)/public.pem
	rm -rf $(CERT_DIR)

version-major:
	@yarn run release -- --release-as major
	@git push --follow-tags origin master

version-minor:
	@yarn run release -- --release-as minor
	@git push --follow-tags origin master

version-release:
	@yarn run release -- --release
	@git push --follow-tags origin master
