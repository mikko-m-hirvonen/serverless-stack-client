import React, { useState, useEffect } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import { API } from "aws-amplify"
import "./Home.css";


export default function Home() {
  const [feedbacks, setFeedbacks] = useState([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }
  
      try {
        const feedbacks = await loadFeedbacks();
        setFeedbacks(feedbacks);
      } catch (e) {
        onError(e);
      }
  
      setIsLoading(false);
    }
  
    onLoad();
  }, [isAuthenticated]);
  
  function loadFeedbacks() {
    return API.get("feedbacks", "/feedbacks");
  }

  function renderFeedbacksList(feedbacks) {
    return [{}].concat(feedbacks).map((feedback, i) =>
      i !== 0 ? (
        <LinkContainer key={feedback.feedbackId} to={`/feedbacks/${feedback.feedbackId}`}>
          <ListGroupItem header={feedback.content.trim().split("\n")[0]}>
            {"Created: " + new Date(feedback.createdAt).toLocaleString()}
          </ListGroupItem>
        </LinkContainer>
      ) : (
        <LinkContainer key="new" to="/feedbacks/new">
          <ListGroupItem>
            <h4>
              <b>{"\uFF0B"}</b> Create a new feedback
            </h4>
          </ListGroupItem>
        </LinkContainer>
      )
    );
  }

  function renderLander() {
    return (
      <div className="lander">
        <h1>Feedbacks</h1>
        <p>A simple Feedback taking app</p>
      </div>
    );
  }

  function renderFeedbacks() {
    return (
      <div className="Feedbacks">
        <PageHeader>Your Feedbacks</PageHeader>
        <ListGroup>
          {!isLoading && renderFeedbacksList(feedbacks)}
        </ListGroup>
      </div>
    );
  }

  return (
    <div className="Home">
      {isAuthenticated ? renderFeedbacks() : renderLander()}
    </div>
  );
}