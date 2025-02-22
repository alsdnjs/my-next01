"use client"
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Button, Grid, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';

function InputForm({label="", type="text", name="", value="", onChange="",
  required=false, onKeyDown=() => {}, xs=12, disabled=false, buttonDisabled=false,
  placeholder="", maxLength=50, autoFocus, endAdornment, onClick="", display, sx}) {
  const [showPassword, setShowPassword] = useState(false);

  // 비밀번호 표시 상태 변경 함수
  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  function textField(){
    // 비밀번호 입력창일 경우
    if(type=="password"){
      return(
        <TextField
        name={name}
        type={showPassword ? "text" : "password"}
        autoFocus={autoFocus}
        required
        fullWidth
        id={name}
        label={label}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        onKeyDown={onKeyDown}
        sx={{mt:"10px"}}
        aria-readonly
        InputProps={{
          style: { borderRadius: 8, display:{display}},
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={handleTogglePasswordVisibility}
                edge="end"
                aria-label="toggle password visibility"
                disabled={buttonDisabled}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      )
      //비밀번호 입력창이 아닐 경우
    } else {
      return(
        <TextField
          name={name}
          type={type}
          fullWidth
          required={required}
          id={name}
          label={label}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          aria-readonly
          sx={{mt:"10px"}}
          InputProps={{
            style: { borderRadius: 8, display:display},
            maxLength: maxLength,  // 최대 글자 수
            endAdornment:  endAdornment ? (             // 텍스트 안에 버튼
              <InputAdornment position="end">
                <Button
                  variant="contained"
                  onClick={onClick}
                  disabled={buttonDisabled}
                > {endAdornment}</Button>
              </InputAdornment>
            ) : null
          }}
        />
      )
    }

  }

  return (
    <Grid item xs={xs}
      sx={{
        fontWeight: "500",
        fontSize: "14px",
        textAlign: 'left',
        display:display
      }}
    >
      <Typography component="label" ml="10px">
        {label}
      </Typography>
      {textField()}

    </Grid>
  );
}

export default InputForm;