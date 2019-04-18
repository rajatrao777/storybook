import React, { Component } from 'react';

import { addons, types } from '@storybook/addons';
import { Consumer, Combo, API } from '@storybook/api';

import { EVENTS, ADDON_ID, PANEL_ID, PARAM_KEY } from './constants';

interface Props {
  active: boolean;
  values: number[] | undefined;
  api: API;
}

class Panel extends Component<Props> {
  constructor(props: Props) {
    super(props);
    this.listener = (data: number) => {
      this.props.api.setAddonState(PARAM_KEY, (current: number[] | undefined = []) =>
        current.concat(data)
      );
    };
  }
  listener: (data: number) => void;
  componentDidMount() {
    this.props.api.on(EVENTS.RESULT, this.listener);
  }
  componentWillUnmount() {
    this.props.api.off(EVENTS.RESULT, this.listener);
  }
  shouldComponentUpdate() {
    return this.props.active;
  }
  render() {
    return (
      <div>
        <button onClick={() => this.props.api.emit(EVENTS.REQUEST)}>click me</button>
        {this.props.values.join(',')}
      </div>
    );
  }
}

const toProps = ({ api }: Combo): { values: number[] | undefined } => {
  return { values: api.getAddonState(PARAM_KEY) || [] };
};

addons.register(ADDON_ID, api => {
  addons.add(PANEL_ID, {
    title: 'Roundtrip Addon',
    type: types.PANEL,
    render: ({ active, key }) => (
      <Consumer filter={toProps}>
        {({ values }: { values: number[] | undefined }) => (
          <Panel api={api} active={active} key={key} values={values} />
        )}
      </Consumer>
    ),
  });
});
