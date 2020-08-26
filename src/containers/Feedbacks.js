import React, { useRef, useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { API, Storage } from "aws-amplify";
import { onError } from "../libs/errorLib";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import "./Feedbacks.css";
import { s3Upload } from "../libs/awsLib"

export default function Feedbacks() {
  const file = useRef(null);
  const { id } = useParams();
  const history = useHistory();
  const [feedback, setFeedback] = useState(null);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    function loadfeedback() {
      return API.get("feedbacks", `/feedbacks/${id}`);
    }

    async function onLoad() {
      try {
        const feedback = await loadfeedback();
        const { content, attachment } = feedback;

        if (attachment) {
          feedback.attachmentURL = await Storage.vault.get(attachment);
        }

        setContent(content);
        setFeedback(feedback);
      } catch (e) {
        onError(e);
      }
    }

    onLoad();
  }, [id]);

  function validateForm() {
    return content.length > 0;
  }
  
  function formatFilename(str) {
    return str.replace(/^\w+-/, "");
  }
  
  function handleFileChange(event) {
    file.current = event.target.files[0];
  }
  
  function saveFeedback(feedback) {
    return API.put("feedbacks", `/feedbacks/${id}`, {
      body: feedback
    });
  }
  
  async function handleSubmit(event) {
    let attachment;
  
    event.preventDefault();
  
    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${
          config.MAX_ATTACHMENT_SIZE / 1000000
        } MB.`
      );
      return;
    }
  
    setIsLoading(true);
  
    try {
      if (file.current) {
        attachment = await s3Upload(file.current);
        await Storage.vault.remove(feedback.attachment);
      }
  
      await saveFeedback({
        content,
        attachment: attachment || feedback.attachment
      });
      history.push("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }
  
  async function handleDelete(event) {
    event.preventDefault();
    const confirmed = window.confirm(
      "Are you sure you want to delete this feedback?"
    );
  
    if (!confirmed) {
        return;
    }
    setIsDeleting(true);

    try {
        await deleteFeedback();
        
        if (feedback.attachment) {
            await Storage.vault.remove(feedback.attachment);
        } 
        history.push("/");
    } catch (e) {
        onError(e);
        setIsDeleting(false);
    }

  }

  async function deleteFeedback() {
    return API.del("feedbacks", `/feedbacks/${id}`);
  }
  
  return (
    <div className="Feedbacks"> 
      {feedback && (
        <form onSubmit={handleSubmit}>
          <FormGroup controlId="content">
            <FormControl
              value={content}
              componentClass="textarea"
              onChange={e => setContent(e.target.value)}
            />
          </FormGroup>
          {feedback.attachment && (
            <FormGroup>
              <ControlLabel>Attachment</ControlLabel>
              <FormControl.Static>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={feedback.attachmentURL}
                >
                  {formatFilename(feedback.attachment)}
                </a>
              </FormControl.Static>
            </FormGroup>
          )}
          <FormGroup controlId="file">
            {!feedback.attachment && <ControlLabel>Attachment</ControlLabel>}
            <FormControl onChange={handleFileChange} type="file" />
          </FormGroup>
          <LoaderButton
            block
            type="submit"
            bsSize="large"
            bsStyle="primary"
            isLoading={isLoading}
            disabled={!validateForm()}
          >
            Save
          </LoaderButton>
          <LoaderButton
            block
            bsSize="large"
            bsStyle="danger"
            onClick={handleDelete}
            isLoading={isDeleting}
          >
            Delete
          </LoaderButton>
        </form>
      )}
    </div>
  );
}