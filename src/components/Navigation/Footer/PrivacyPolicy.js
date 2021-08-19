import React from "react";
import { privacyHtml } from "./privacy";
import { Container, Row } from "reactstrap";
export default function PrivacyPolicy() {
  return (
    <main>
      <section
        className="section section-lg section-shaped pb-5"
        style={{
          overflow: "visible",
        }}
      >
        <div className="shape shape-style-1 shape-default">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>

        <Container>
          <Row className="justify-content-center text-center">
            <h3
              className="display-3"
              style={{
                color: "white",
              }}
            >
              Privacy Policy
            </h3>
          </Row>
        </Container>
      </section>
      {/* display privacy policy HTML markup by setting innerHTML */}
      <div
        dangerouslySetInnerHTML={{ __html: privacyHtml }}
        className="m-5 py-3 px-5 text-justify"
      ></div>
    </main>
  );
}
