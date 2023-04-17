import React from 'react';

function Alert(props) {

  const capitalize = (word) => {
    if(word === "danger"){
      word = "error";
    }
    const lower = word.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  }

  return (
    //props.alert if true then further code will be evaluated if its not null then further code will implement(this is so because JSX converts to javascript calls)
    props.alert && <div className={`alert alert-${props.alert.type} alert-dismissible fade show`} role="alert">
    <strong>{capitalize(props.alert.type)}</strong> : {props.alert.msg}
    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>
  );
}

export default Alert;
