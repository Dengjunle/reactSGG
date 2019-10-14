import React, { Component } from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
// import _ from 'lodash';
import PropTypes from 'prop-types'


import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

class RichTextEditor extends Component {

    static propTypes = {
        detail: PropTypes.string
    }

    state = {
        editorState: EditorState.createEmpty(),
    }

    //   onEditorStateChange = _.debounce((editorState) => {
    //     console.log('---')
    //     this.setState({
    //       editorState,
    //     });
    //   },500);
    onEditorStateChange = (editorState) => {
        // console.log('---')
        this.setState({
            editorState,
        });
    };

    componentWillMount() {
        const { detail } = this.props
        if (detail) {
            const contentBlock = htmlToDraft(detail);
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            this.state = {
                editorState,
            };
        }

    }

    getDetail = () => draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))


    uploadImageCallBack = (file) => {
        return new Promise(
            (resolve, reject) => {//执行器函数
                const xhr = new XMLHttpRequest();
                xhr.open('POST', '/manage/img/upload');
                xhr.setRequestHeader('Authorization', 'Client-ID XXXXX');
                const data = new FormData();
                data.append('image', file);
                xhr.send(data);
                xhr.addEventListener('load', () => {
                    const response = JSON.parse(xhr.responseText);
                    resolve(response);
                });
                xhr.addEventListener('error', () => {
                    const error = JSON.parse(xhr.responseText);
                    reject(error);
                });
            }
        );
    }

    render() {
        const { editorState } = this.state;
        return (
            <div>
                <Editor
                    editorState={editorState}
                    editorStyle={{ height: 200, border: '1px solid black', paddingLeft: 10 }}
                    onEditorStateChange={this.onEditorStateChange}
                    localization={{
                        locale: 'zh',
                    }}
                    toolbar={{
                        image: { uploadCallback: this.uploadImageCallBack, alt: { present: true, mandatory: true } },
                    }}
                />
                {/* <textarea
          disabled
          value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
        /> */}
            </div>
        );
    }
}

export default RichTextEditor