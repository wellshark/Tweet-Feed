import React, {Component} from 'react';
import Textarea from "../../common/textarea/Textarea";
import Button from "../../common/button/Button";
import './DashboadForm.scss'

class DashboardForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isFormFieldsValid: {titleStatus: null, descriptionStatus: null},
            imgSrc: ''
        }
    }

    // validateField

    setTextareaValidateStatus = e => {
        const name = e.target.name;
        const value = e.target.value;
        if (value.length) {
            this.setState({
                ...this.state,
                isFormFieldsValid: {
                    ...this.state.isFormFieldsValid,
                    [`${name}Status`]: true
                }
            })
        } else {
            this.setState({
                ...this.state,
                isFormFieldsValid: {
                    ...this.state.isFormFieldsValid,
                    [`${name}Status`]: false
                }
            })
        }
    };

    isFormValid(titleValue, descriptionValue) {
        return Boolean(titleValue && descriptionValue)
    }

    isTextareaInvalid(value) {
        if (value === null) {
            return false;
        }
        return !Boolean(value);
    }

    loadFile = (e) => {
        // const output = document.getElementById('output');
        this.setState({
            ...this.state,
            imgSrc: URL.createObjectURL(e.target.files[0]),
        });
    };

    renderUploadPreview() {
        const imgSrc = this.state.imgSrc;
        return imgSrc ?
            (<img
                width="200"
                src={imgSrc}
                alt='upload preview'
                className='upload-image__preview dashboard__upload-preview mb-20'/>) : null;

    }

    renderUploadImg(){
        const {isUploadImg} = this.props;
        return isUploadImg ? (<div className="upload-image dashboard__upload-image">
            <input type="file" accept="image/*" onChange={this.loadFile}
                   className='upload-image__input dashboard__image-input mb-20'/>
            {this.renderUploadPreview()}
        </div>) : null;
    }

    render() {
        const {buttonText, handleSubmit, handleUserInput, formTitle, formDescription} = this.props;
        // const {imgSrc} = this.state;
        const {titleStatus, descriptionStatus} = this.state.isFormFieldsValid;
        return (
            <form className="dashboard__form" onSubmit={handleSubmit}
                  noValidate="">
                <Textarea className='mb-20 dashboard__textarea' name="title"
                          placeholder='Title'
                          value={formTitle}
                          onBlur={(e) => this.setTextareaValidateStatus(e)}
                          onChange={(e) => {
                              handleUserInput(e);
                          }}
                          isInvalid={this.isTextareaInvalid(titleStatus)}
                />
                <Textarea className='mb-20 dashboard__textarea'
                          name="description" rows="5"
                          placeholder='Description'
                          value={formDescription}
                          onBlur={(e) => this.setTextareaValidateStatus(e)}
                          onChange={(e) => {
                              handleUserInput(e);
                          }}
                          isInvalid={this.isTextareaInvalid(descriptionStatus)}
                />
                {this.renderUploadImg()}


                <Button type='submit' buttonColorScheme='blue' buttonSize='large'
                        disabled={!this.isFormValid(formTitle, formDescription)}>{buttonText}</Button>
            </form>
        );
    }
}

export default DashboardForm;
