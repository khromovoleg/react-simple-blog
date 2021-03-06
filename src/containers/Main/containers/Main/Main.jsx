import React, { useEffect, useState } from "react";

import { push } from "connected-react-router";
import { useDispatch, useSelector } from "react-redux";
import jwt from "jsonwebtoken";
import * as queryString from "query-string";

import { ROUTES_PATH } from "router/constants";
import { actions } from "store/actions";
import { getAuth } from "containers/Auth/store/selectors";

import { Header } from "containers/Header/containers";
import { SideBar } from "containers/SideBar/containers";
import { CssBaseline, Grid } from "@material-ui/core";

import useStyles from "./stylels";
import "./index.scss";

const Main = ({ children, location }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const { isAuth } = useSelector(getAuth());

  useEffect(() => {
    if (!isAuth) {
      const token = localStorage.getItem("token");

      if (token) {
        const decoded = jwt.decode(token);

        if (decoded.exp < new Date().getTime()) {
          localStorage.removeItem("token");
          dispatch(push(ROUTES_PATH.SIGN_IN));
        } else {
          dispatch(actions.SIGN_IN.SUCCEEDED(token));
          dispatch(actions.USER_FETCH.SUCCEEDED(decoded.user));
          localStorage.setItem("token", token);
        }
      } else {
        dispatch(push(ROUTES_PATH.SIGN_IN));
      }
    } else {
      const params = queryString.parse(location.search, {
        parseNumbers: true,
        sort: false,
      });

      dispatch(push(`${ROUTES_PATH.ARTICLES}?${new URLSearchParams(params).toString()}`));
    }
  }, [isAuth, dispatch, location.search]);

  return isAuth ? (
    <div className={classes.root}>
      <CssBaseline />
      <Header open={open} setOpen={setOpen} />
      <SideBar open={open} setOpen={setOpen} />
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Grid container spacing={2} className={classes.container}>
          <Grid item xs={12}>
            {children}
          </Grid>
        </Grid>
      </main>
    </div>
  ) : null;
};

export default Main;
