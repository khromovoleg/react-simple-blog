import React, { useEffect } from "react";

import { push } from "connected-react-router";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import * as queryString from "query-string";
// import { v4 as uuidv4 } from "uuid";

import { ROUTES_PATH } from "router/constants";
import { actions } from "store/actions";
import { getAllArticles } from "containers/Articles/store/selectors";

import { ArticleShort } from "containers/Articles/components";
import { Pagination } from "shared/components/Pagination";
import { Filter } from "shared/components/Filter";
import { Container, Grid, Button, Typography } from "@material-ui/core";

import useStyles from "./styles";
import "./index.scss";

export default ({ location: { search } }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const params = queryString.parse(search, { parseNumbers: true, sort: false });
  let { articles, loading, advancedSearch, count } = useSelector(getAllArticles());

  useEffect(() => {
    dispatch(actions.ARTICLES_FETCH.REQUESTED({ ...advancedSearch, ...params }));
  }, []);

  const handleUpdateArticles = (e) => {
    let fieldName = e.currentTarget.name || "skip";
    let fieldValue = e.currentTarget.value || Number(e.currentTarget.dataset.page);

    advancedSearch = {
      ...advancedSearch,
      [fieldName]: fieldValue,
    };

    dispatch(
      actions.ARTICLES_UPDATE.REQUESTED(advancedSearch),
      dispatch(push(`${ROUTES_PATH.ARTICLES}?${new URLSearchParams(advancedSearch).toString()}`))
    );
  };

  return (
    <div>
      <Container>
        <div className={classes.heroButtons}>
          <Grid container spacing={2}>
            <Grid item>
              <Button onClick={() => dispatch(push(`${ROUTES_PATH.ARTICLES}/new`))} variant="contained" color="primary">
                {t("Add new article")}
              </Button>
            </Grid>
          </Grid>
        </div>
      </Container>
      {!loading ? (
        <>
          <Filter filter={advancedSearch} onUpdateArticles={handleUpdateArticles} />
          {articles.length > 0 ? (
            <>
              <Container className={classes.cardGrid}>
                <Grid container spacing={4}>
                  {articles.map((article) => (
                    <Grid item key={article.id} xs={12} sm={6} md={4}>
                      <ArticleShort {...article} key={article.id} />
                    </Grid>
                  ))}
                </Grid>
              </Container>
              <Pagination countObj={count} filter={advancedSearch} onUpdateArticles={handleUpdateArticles} />
            </>
          ) : (
            <Container className={classes.cardGrid}>
              <Typography align="center" variant="h5" component="h5">
                No result. Change request
              </Typography>
            </Container>
          )}
        </>
      ) : (
        <Container className={classes.cardGrid}>
          <div>Preloading...</div>
        </Container>
      )}
    </div>
  );
};
