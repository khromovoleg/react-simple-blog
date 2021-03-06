import React, { useEffect, useState, useCallback } from "react";

import { push } from "connected-react-router";
import { useDispatch, useSelector } from "react-redux";
import jwt from "jsonwebtoken";
import { Link } from "react-router-dom";

import { ROUTES_PATH } from "router/constants";
import { actions } from "store/actions";
import { FORMS } from "containers/Auth/constants/forms";
import { getUser } from "containers/User/store/selectors";

import { Auth } from "containers/Auth/containers/Auth";
import {
  Typography,
  FormControl,
  Button,
  InputAdornment,
  IconButton,
  OutlinedInput,
  InputLabel,
  FormHelperText,
} from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { Formik, Form } from "formik";

import useStyles from "./styles";
import "./index.scss";

const ResetPassword = ({
  match: {
    params: { token },
  },
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = useSelector(getUser());
  const [isExpiredToken, setIsExpiredToken] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

  const fetchUserBeforeReset = useCallback(
    (id) => {
      dispatch(actions.USER_FETCH.REQUESTED(id));
    },
    [dispatch]
  );

  useEffect(() => {
    if (token) {
      const decoded = jwt.decode(token);

      if (decoded) {
        setIsExpiredToken(decoded.exp < new Date().getTime());
        fetchUserBeforeReset(decoded.data);
      } else {
        dispatch(push(ROUTES_PATH.SIGN_IN));
      }
    } else {
      dispatch(push(ROUTES_PATH.SIGN_IN));
    }
  }, [dispatch, fetchUserBeforeReset, token]);

  const handleSubmit = (data) => {
    dispatch(actions.RESET.REQUESTED({ userId: user.id, ...data }));
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleClickShowPasswordConfirmation = () => {
    setShowPasswordConfirmation(!showPasswordConfirmation);
  };

  const handleMouseDownPasswordConfirmation = (event) => {
    event.preventDefault();
  };

  return (
    <Auth>
      <img src="/assets/icons/login.svg" alt="Reset Password" className={classes.icon} />
      <Typography variant="button">Reset Password</Typography>
      {isExpiredToken ? (
        <>
          <Typography variant="body1" display="block" gutterBottom align="center">
            Link for change password is expired
          </Typography>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={() => dispatch(push(ROUTES_PATH.FORGOT))}
          >
            Go To Forgot Password
          </Button>
        </>
      ) : (
        <Formik initialValues={FORMS.RESET.INIT} validationSchema={FORMS.RESET.SCHEME} onSubmit={handleSubmit}>
          {({
            errors,
            touched,
            values: { password, confirmationPassword },
            handleChange,
            setFieldValue,
            setFieldTouched,
          }) => {
            return (
              <Form className={classes.form}>
                <FormControl
                  margin="normal"
                  fullWidth
                  variant="outlined"
                  error={touched.password && Boolean(errors.password)}
                >
                  <InputLabel htmlFor="password">Password</InputLabel>
                  <OutlinedInput
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setFieldValue("password", e.target.value);
                      setFieldTouched("password", true, false);
                    }}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    }
                    labelWidth={75}
                  />
                  <FormHelperText error={Boolean(errors.password)}>
                    {touched.password && errors.password}
                  </FormHelperText>
                </FormControl>
                <FormControl
                  margin="normal"
                  fullWidth
                  variant="outlined"
                  error={touched.confirmationPassword && Boolean(errors.confirmationPassword)}
                >
                  <InputLabel htmlFor="password">Confirmation Password</InputLabel>
                  <OutlinedInput
                    id="password"
                    name="password"
                    type={showPasswordConfirmation ? "text" : "password"}
                    value={confirmationPassword}
                    onChange={(e) => {
                      setFieldValue("confirmationPassword", e.target.value);
                      setFieldTouched("confirmationPassword", true, false);
                    }}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPasswordConfirmation}
                          onMouseDown={handleMouseDownPasswordConfirmation}
                        >
                          {showPasswordConfirmation ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    }
                    labelWidth={175}
                  />
                  <FormHelperText error={Boolean(errors.confirmationPassword)}>
                    {touched.confirmationPassword && errors.confirmationPassword}
                  </FormHelperText>
                </FormControl>
                <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
                  Reset
                </Button>
                <div className={classes.actions}>
                  <div className={classes.actionsItem}>
                    <Link to={ROUTES_PATH.SIGN_IN} className={classes.link}>
                      <Typography variant="caption" color="primary">
                        Back to Login
                      </Typography>
                    </Link>
                  </div>
                </div>
              </Form>
            );
          }}
        </Formik>
      )}
    </Auth>
  );
};
export default ResetPassword;
