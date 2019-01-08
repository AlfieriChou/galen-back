#####################################
time = $(shell date +"%Y-%m-%d-%H-%M-%S")
image = "alfierichou/sequelize_swagger"
imageID = docker images 'sequelize_swagger' | uniq

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
