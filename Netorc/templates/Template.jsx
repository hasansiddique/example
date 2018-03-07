//lodash
import _eq from 'lodash/eq';
import _get from 'lodash/get';
import _each from 'lodash/each';
import _isEqual from 'lodash/isEqual';

// imports
import React, {Component} from 'react';
import PropTypes from 'prop-types';

// utils
import Button from '../../../common/components/Button.jsx';

// Template Component
class Template extends Component {
  constructor(props, refs) {
    super(props, refs);
    this.state = {
      selectedCommands: ''
    };
    this.closeModal = this.closeModal.bind(this);
  }

  selectedTempConfig() {
    const {templates} = this.props;
    let templateId = this.refs.templateId.value.trim();
    templateId !== "" ?
    _each(_get(templates, 'templates'), (tmp) => {
      if (_eq(tmp.id, templateId)) {
        this.setState({selectedCommands: tmp.commands});
      }
    })
      :
      this.setState({selectedCommands: ''});
  }

  handleSubmit(event) {
    const {templateCurrentState} = this.props;
    event.preventDefault();
    let templateId = this.refs.templateId.value.trim();
    this.props.lastUpdatedTemplateId(templateId);
    if (_isEqual(templateCurrentState, 'templateSelection')) {
      this.props.TemplateState('templateSelected');
    }
    this.props.closeModal();
  }

  closeModal() {
    this.props.TemplateState('');
    this.props.closeModal();
  }

  render() {
    const _this = this;
    const {templates} = this.props;
    const styles = Template.styles;

    return (
      <div>
        <form name="singleInputForm" onSubmit={this.handleSubmit.bind(this)}>

          <div className="modal-header">Deploy Templates</div>

          <div className="modal-body">
            <div className="row collapse">
              <div className="small-3 columns">
                <label className="prefix radius" htmlFor="template">Template</label>
              </div>
              <div className="small-9 columns">
                <select ref="templateId" name="templateId" id="templateId" required
                        onChange={_this.selectedTempConfig.bind(_this)}>
                  <option value="">Select Templates</option>
                  {
                    _get(templates, 'templates').map(function (tmp, index) {
                      return (
                        <option key={index}
                                value={tmp.id}>{tmp.name}
                        </option>
                      );
                    })
                  }
                </select>
              </div>
              {_this.state.selectedCommands && (
                <div className="small-12 columns config">
                <pre className="custom-scroll">
                  {_this.state.selectedCommands}
                </pre>
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <Button
              text="Cancel"
              onClick={this.closeModal.bind(this)}
              style={styles.cancelButton}
              hoverStyles={styles.cancelHover}
            />
            <Button
              text="Select Gateways"
              type="submit"
              disabled={_this.state.selectedCommands === ""}
            />
          </div>

        </form>
      </div>
    );
  }
}

Template.propTypes = {
  closeModal: PropTypes.func.isRequired
};

Template.styles = {
  cancelButton: {
    backgroundColor: 'transparent',
    border: '1px solid #777',
    color: '#777'
  },
  cancelHover: {
    backgroundColor: 'transparent',
    border: '1px solid #222',
    color: '#222'
  }
};

export default Template;
