// imports
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Collapsible from 'react-collapsible';
import {saveAs} from 'file-saver';

import Button from '../../../common/components/Button.jsx';
import Label from '../../../common/components/Label.jsx';
import {decodeBase64Data} from './templates.utils';

class TemplateDetails extends Component {
  constructor(props) {
    super(props);
    this.closeModal = this.closeModal.bind(this);
  }

  closeModal() {
    this.props.closeModal();
  }

  onHandleSaveFile(result, name) {
    let blob = new Blob([decodeBase64Data(result)], {type: "text/plain;charset=utf-8"});
    saveAs(blob, `${name}.txt`);
  }

  render() {
    const {lastTemplateData} = this.props;
    const styles = TemplateDetails.styles;

    return (
      <div>
        <div className="modal-header">Deployed Template Details</div>

        <div className="modal-body" style={styles.modalBody}>
          <div className="modal-wrapper">
          {lastTemplateData.succeeded.map((item, index) => {
            return (
              <div style={styles.gateway} key={index}>
                <Collapsible trigger={`${item.gateway.name} `} style={styles.collapse}>
                  <div style={styles.labelWrapper}>
                    <Label
                      onClick={() => this.onHandleSaveFile(item.result, item.gateway.name)}
                      text="Download as text file"
                    />
                  </div>
                  <pre style={styles.config}>{decodeBase64Data(item.result)}</pre>
                </Collapsible>
              </div>
            );
          })}
        </div>
        </div>

        <div className="modal-footer">
          <Button
            text="Close"
            onClick={this.closeModal.bind(this)}
            style={styles.cancelButton}
            hoverStyles={styles.cancelHover}
          />
        </div>

      </div>
    );
  }
}

TemplateDetails.styles = {
  modalBody: {
    paddingTop: `5px`,
    paddingBottom: `15px`
  },
  gateway: {
    fontSize: `14px`,
    padding: `5px 10px`,
    border: `thin solid #e1e1e1`,
    marginTop: `-1px`
  },
  config: {
    border: `thin solid #e1e1e1`,
    padding: `5px 10px`,
    fontSize: `14px`,
    backgroundColor: `#f2f2f2`
  },
  collapse: {
    marginBottom: `10px`
  },
  cancelButton: {
    backgroundColor: 'transparent',
    border: '1px solid #777',
    color: '#777'
  },
  cancelHover: {
    backgroundColor: 'transparent',
    border: '1px solid #222',
    color: '#222'
  },
  labelWrapper: {
    width: '100%',
    textAlign: 'right'
  }
};

export default TemplateDetails;
