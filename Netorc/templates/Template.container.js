// imports
import {connect} from 'react-redux';
import Template from './Template.jsx';

// actions
import {
  updateSelectedTemplateNodes,
  TemplateState,
  lastUpdatedTemplateId
} from './templates.actions.js';

// Redux Mapping
const mapStateToProps = ({reducers}) => ({
  templates: reducers.templates,
  nodes: reducers.gateways.gateway,
  selectedTemplateNodes: reducers.templates.selectedTemplateNodes,
  templateCurrentState: reducers.templates.templateCurrentState
});

const mapDispatchToProps = dispatch => ({
  TemplateState: state => dispatch(TemplateState(state)),
  updateSelectedTemplateNodes: nodes => dispatch(updateSelectedTemplateNodes(nodes)),
  lastUpdatedTemplateId: templateId => dispatch(lastUpdatedTemplateId(templateId))
});

export default connect(mapStateToProps, mapDispatchToProps)(Template);

