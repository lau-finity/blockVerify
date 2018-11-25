/**
 *
 * LookupItemPage
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { compose } from 'redux';
import QrReader from "react-qr-reader";
import { withStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import VerifiedIcon from '@material-ui/icons/CheckCircle';
import UnverifiedIcon from '@material-ui/icons/ReportProblem';
import CircularProgress from '@material-ui/core/CircularProgress';
import EarthJS from 'earthjs'

import messages from './messages';

const styles = theme => ({
  container: {
    padding: '1rem 0',
    height: '100%',
  },
  textContainer: {
    margin: '1rem 0',
    padding: '0 1rem',
    transition: 'all .4s ease-in',
    opacity: 1,
  },
  textContainerHideAnimation: {
    opacity: 0,
  },
  qrcode: {
    width: '100%',
    height: 'auto',
  },
  qrcodeScannedContainer: {
    position: 'relative',
  },
  itemStatus: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    transition: 'all .4s ease-in',
    opacity: 0,
    fontSize: '2rem',
  },
  itemStatusVerified: {
    color: '#279f27',
  },
  itemStatusUnverified: {
    color: '#cc7000',
  },
  itemStatusShowAnimation: {
    opacity: 1,
    fontSize: '10rem',
  },
  progress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
});

const transparentPng = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

const STATUS_VERIFIED = 1;
const STATUS_UNVERIFIED = 2;

/* eslint-disable react/prefer-stateless-function */
export class LookupItemPage extends React.Component {
  state = {
    itemId: null,
    item: null,
    isLoading: false,
    itemVerifiedStatus: null,
    qrcodeShowStatus: false,
  }

  handleScan = (value) => {
    const {
      itemId,
    } = this.state;
    if (!itemId && value) {
      this.setState({
        itemId: value,
        item: null,
        isLoading: true,
        itemVerifiedStatus: null,
      });

      const item = {
        ownerAddress: '123',
        name: 'iPhone X',
        description: '64GB Grey',
      };

      setTimeout(() => {
      // fetch('https://chashmeetsingh.lib.id/@dev/chashmeetsingh/getmanufacturer?id=' + item.ownerAddress)
        // .then((res) => res.json())
        // .then((body) => {
          // const manufacturer = body.data;
          // const manufacturer = null;
          const manufacturer = {
            name: 'Apple Inc.',
            address: 'Apple Headquarters 1 Infinite Loop Cupertino, CA 95014',
            logo: 'https://www.apple.com/ac/structured-data/images/knowledge_graph_logo.png',
          };

          item.manufacturer = manufacturer;

          this.setState({
            isLoading: false,
            itemVerifiedStatus: manufacturer ? STATUS_VERIFIED : STATUS_UNVERIFIED,
            qrcodeShowStatus: false,
          });

          setTimeout(() => {
            this.setState({
              qrcodeShowStatus: true,
            });
          }, 100);

          setTimeout(() => {
            this.setState({
              qrcodeShowStatus: false,
            });

            setTimeout(() => {
              this.setState({
                item,
              });
            }, 400);
          }, 1200);
        // })
      }, 1500);
    }
  }

  render() {
    const {
      classes,
    } = this.props;
    const {
      itemId,
      item,
      isLoading,
      itemVerifiedStatus,
      qrcodeShowStatus,
    } = this.state;
    const isScanning = !item;

    // const g = EarthJS()
    // .register(earthjs.plugins.inertiaPlugin())
    // .register(earthjs.plugins.clickCanvas())
    // .register(earthjs.plugins.threejsPlugin())
    // .register(earthjs.plugins.autorotatePlugin())
    // .register(earthjs.plugins.dropShadowSvg())
    // .register(earthjs.plugins.globeThreejs('world_1.jpg'))
    // .register(earthjs.plugins.worldThreejs('world-110m.json'))
    // .register(earthjs.plugins.flightLineThreejs('flights.json','point3.png'))
    // g.inertiaPlugin.selectAll('#three-js')

    // const g = earthjs()
    // .register(earthjs.plugins.graticuleSimple())
    // .create();

    return (
      <div className={classes.container}>
        <Helmet>
          <title>
            {isScanning ? 'Scan Item' : item.name}
          </title>
        </Helmet>

        {isScanning && (
          <Typography
            className={classes.textContainer + ' ' + (itemId !== null ? classes.textContainerHideAnimation : '')}
            variant="h6" color="inherit">
            <FormattedMessage {...messages.heading} />
          </Typography>
        )}

        {itemId === null && (
          <QrReader
            className={classes.qrcode}
            delay={500}
            onScan={this.handleScan}
            onError={(err) => console.error(err)}
          />
        )}

        {itemId !== null && (
          <div className={classes.qrcodeScannedContainer}>
            {item === null && (
              <img
                className={classes.qrcode}
                src={transparentPng}
                alt=""
                aria-hidden
              />
            )}

            {item !== null && (
              <div>
                {item.manufacturer && (
                  <Fragment>
                    <Typography className={classes.textContainer} variant="h6" color="inherit">
                      <strong>Manufacturer</strong>

                      <br/>

                      {item.manufacturer.name}

                      {itemVerifiedStatus === STATUS_VERIFIED && (
                        <VerifiedIcon
                          className={classes.itemStatusVerified}
                          style={{ float: 'right' }}
                        />
                      )}
                    </Typography>

                    <p className={classes.textContainer}>
                      {item.manufacturer.address}
                    </p>
                  </Fragment>
                )}

                <Typography className={classes.textContainer} variant="h6" color="inherit">
                  <strong>Item</strong>

                  <br/>

                  {item.name}

                  {itemVerifiedStatus === STATUS_UNVERIFIED && (
                    <UnverifiedIcon
                      className={classes.itemStatusUnverified}
                      style={{ float: 'right' }}
                    />
                  )}
                </Typography>

                {itemVerifiedStatus === STATUS_VERIFIED && (
                  <p className={classes.textContainer + ' ' + classes.itemStatusVerified}>
                    Manufacturer of this item is verified.
                  </p>
                )}

                {itemVerifiedStatus === STATUS_UNVERIFIED && (
                  <p className={classes.textContainer + ' ' + classes.itemStatusUnverified}>
                    <strong>Beware!</strong> Manufacturer of this item is not
                    verified.
                  </p>
                )}

                <p className={classes.textContainer}>
                  {item.description}
                </p>

                <p className={classes.textContainer}>
                  {item.description}
                </p>
              </div>
            )}

            {isLoading && (
              <CircularProgress className={classes.progress} />
            )}

            {!isLoading && (
              <Fragment>
                {itemVerifiedStatus === STATUS_VERIFIED && (
                  <VerifiedIcon
                    className={
                      classes.itemStatus + ' ' +
                      classes.itemStatusVerified + ' ' +
                      (qrcodeShowStatus ? classes.itemStatusShowAnimation : '')
                    }
                  />
                )}

                {itemVerifiedStatus === STATUS_UNVERIFIED && (
                  <UnverifiedIcon
                    className={
                      classes.itemStatus + ' ' +
                      classes.itemStatusUnverified + ' ' +
                      (qrcodeShowStatus ? classes.itemStatusShowAnimation : '')
                    }
                  />
                )}
              </Fragment>
            )}
          </div>
        )}

        {isScanning && (
          <div
            className={classes.textContainer + ' ' + (itemId !== null ? classes.textContainerHideAnimation : '')}
          >
            <FormattedMessage {...messages.description} />
          </div>
        )}

      </div>
    );
  }
}

LookupItemPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  null,
  mapDispatchToProps,
);

export default compose(withConnect)(withStyles(styles)(LookupItemPage));
