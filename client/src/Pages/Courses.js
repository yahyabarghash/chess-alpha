import "./FrontPage.css";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Header from "../components/Header/Header";
import Dashboard from "../components/Dashboard/Dashboard";
import Footer from "../components/Footer/Footer";

import "./Courses.css";

const categories = [];

const Courses = () => {
  return (
    <div>
      <Container fluid>
        <Header />
        <Container fluid>
          <Row>
            <Col sm={8} md={8} lg={8}>
              <Dashboard
                variationExist={true}
                now={60}
                numberOfVariations="60/100"
                courseName="Queen Opening"
              />
              <Dashboard
                variationExist={true}
                now={60}
                numberOfVariations="60/100"
                courseName="Queen Opening"
              />
              <Dashboard
                variationExist={true}
                now={60}
                numberOfVariations="60/100"
                courseName="Queen Opening"
              />
            </Col>
            <Col sm={4} md={4} lg={4}>
              {" "}
              New Courses Here
            </Col>
          </Row>
        </Container>
      </Container>
      <Footer />
    </div>
  );
};

export default Courses;
