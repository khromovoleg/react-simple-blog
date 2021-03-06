import React from "react";

import { Container, Grid, FormControl, InputLabel, Input, InputAdornment, Select } from "@material-ui/core";
import { Search } from "@material-ui/icons";

import useStyles from "./styles";
import "./index.scss";

export default ({ filter, onUpdateArticles }) => {
  const classes = useStyles();
  const { searchStr, order, limit } = filter;

  return (
    <form action="">
      <Container className={classes.filterWrap}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <FormControl className={classes.formControlSearch}>
              <InputLabel htmlFor="input-with-icon-adornment">Search article</InputLabel>
              <Input
                id="input-with-icon-adornment"
                name="searchStr"
                value={searchStr}
                startAdornment={
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                }
                onChange={onUpdateArticles}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={8} className={classes.gridSelect}>
            <FormControl className={classes.formControl + " " + classes.selectSortBy}>
              <InputLabel id="order-label">Sort by</InputLabel>
              <Select native labelId="order-label" id="order" name="order" value={order} onChange={onUpdateArticles}>
                <option value="created_at_desc">Created Date &#8595;</option>
                <option value="created_at_asc">Created Date &#8593;</option>
                <option value="title_desc">Name &#8595;</option>
                <option value="title_asc">Name &#8593;</option>
              </Select>
            </FormControl>
            <FormControl className={classes.formControl}>
              <InputLabel id="limit-label">Per page</InputLabel>
              <Select native labelId="limit-label" id="limit" name="limit" value={limit} onChange={onUpdateArticles}>
                <option value={4}>4</option>
                <option value={8}>8</option>
                <option value={12}>12</option>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Container>
    </form>
  );
};
