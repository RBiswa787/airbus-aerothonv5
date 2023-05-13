import React, { Component } from "react";
import axios from "axios";
 
export default class FileUploadSubassembly extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
      File: "",
      responseMsg: {
        status: "",
        message: "",
        error: "",
      },
    };
  }
  
  // File onchange hander
  handleChange = (e) => {
    const FilesArray = [];
  
    for (let i = 0; i < e.target.files.length; i++) {
      this.fileValidate(e.target.files[i]);
      FilesArray.push(e.target.files[i]);
    }
    this.setState({
      File: FilesArray,
    });
  };
  
  // submit handler
  submitHandler = (e) => {
    e.preventDefault();
    const data = new FormData(); 
    for (let i = 0; i < this.state.File.length; i++) {
      data.append("files[]", this.state.File[i]);
    }
  
    axios.post("http://127.0.0.1:5000/subassembly", data)
    .then((response) => {
            console.log(response)
        if (response.status === 201) {
          this.setState({
            responseMsg: {
              status: response.data.status,
              message: response.data.message,
            },
          });
          setTimeout(() => {
            this.setState({
              File: "",
              responseMsg: "",
            });
          }, 100000);
  
          document.querySelector("#FileForm").reset();
        }
            alert("Successfully Uploaded");
    })
    .catch((error) => {
        console.error(error); 
        if (error.response) {
            console.log(error.response)
            if (error.response.status === 401) {
                alert("Invalid credentials");
            }
        }
    });
     
  };
  
  // file validation
  fileValidate = (file) => {
    if (
      file.type === "File/csv" ||
      file.type === "File/xlsx" 
    ) {
      this.setState({
        responseMsg: {
          error: "",
        },
      });
      return true;
    } else {
      this.setState({
        responseMsg: {
          error: "File type allowed only jpg, png, jpeg",
        },
      });
      return false;
    }
  };
  
  render() {
    return (
      <div className="container py-5">
        <div className="row">
          <div className="col-lg-12">
            <form onSubmit={this.submitHandler} encType="multipart/form-data" id="FileForm">
              <div className="card shadow">
  
                {this.state.responseMsg.status === "successs" ? (
                  <div className="alert alert-success">
                    {this.state.responseMsg.message}
                  </div>
                ) : this.state.responseMsg.status === "failed" ? (
                  <div className="alert alert-danger">
                    {this.state.responseMsg.message}
                  </div>
                ) : (
                  ""
                )}
                <div className="card-header">
                  <h4 className="card-title fw-bold">
                    UPLOAD YOUR FILE HERE
                  </h4>
                </div>
  
                <div className="card-body">
                  <div className="form-group py-2">
                    <label htmlFor="Files">Files</label>
                    <input
                      type="file"
                      name="File"
                      multiple
                      onChange={this.handleChange}
                      className="form-control"
                    />
                    <span className="text-danger">
                      {this.state.responseMsg.error}
                    </span>
                  </div>
                </div>
  
                <div className="card-footer">
                  <button type="submit" className="btn btn-success">
                    Upload
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
  
      </div>
    );
  }
}