import * as React from 'react';
// import styles from './Editdetails.module.scss';
import { IEditdetailsProps } from './IEditdetailsProps';
// import { escape } from '@microsoft/sp-lodash-subset';
import EditForm from './Edit';

export default class Editdetails extends React.Component<IEditdetailsProps, {}> {
  public render(): React.ReactElement<IEditdetailsProps> {

    return (
      <div>
        <EditForm />
      </div>
    );
  }
}
