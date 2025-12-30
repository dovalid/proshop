# **Proshop Webshop**
## **User guide**

#### **Frontend - Hot reload**
* Lépj bele az react-frontend mappába.
* Telepítsd a függőségeket.
    * "yarn"
    * "npm install"
* Indítsd el az applikácót.
    *  "yarn start" 
    *  "npm start"
* A frontendet a [localhost:3000](localhost:3000)-es porton éred el.
* A backend nem fut.

#### **Backend futtatása**
* Lépj bele az app/java-backend mappába
* Indítsd el a backendet.
    * "mvn spring-boot:run"
* A backendet a [localhost:8080](localhost:8080)-as porton éred el.
* A frontend nem fut.

#### **Backend és Frontend**
* Lépj bele az app/java-backend mappába
* Futtasd az alábbi parancsot.
    * "mvn clean install"
* Indíthatod el a Java backendet és a React frontendet egyszerre.
    * "java -jar target/rendszf-0.0.1-SNAPSHOT.jar"
* A frontendet a [localhost:8080](localhost:8080)-es porton éred el.

A projekt deploy:
* [herokun](https://proshop-webshop-38e28d785b85.herokuapp.com//)