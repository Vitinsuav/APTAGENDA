import { KeyboardEvent, useState } from 'react';
import Grid from '@mui/material/Grid';
import { Button, TextField } from '@mui/material';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../context/AuthProvider/useAuth';
import  Logo  from '../../assets/logo300.png';
import { useSnackbar } from 'notistack';
import { AxiosResponse } from 'axios';


export function SignIn() {
    const { enqueueSnackbar } = useSnackbar();
    const [failureLogin, setFailureLogin] = useState(false)
    const [failurePassword, setFailurePassword] = useState(false)
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const history = useNavigate();
    const auth = useAuth();

    async function handleSignIn(){
        if(user === ''){
            setFailureLogin(true);
            return;
        }else{
            setFailureLogin(false);
        }

        if(password === ''){
            setFailurePassword(true);
            return;
        }else{
            setFailurePassword(false);
        }
 
        try{
            await auth.authenticate(user, password);

            history('/Schedule');
        }catch(error){
            enqueueSnackbar(`Usuário ou senha inválido`, { variant: 'error', autoHideDuration: 4000 }); 
            console.log('erro: ' + error);
        }
    }

    function handelKeyDown(e: KeyboardEvent){
        if(e.key === 'Enter'){
            handleSignIn();
        }
    }

  return (     

    
      <Grid minHeight={'100vh'}  container alignItems="center" justifyContent="center" flexDirection={"column"} padding="25px">
        <Grid item={true}  xs={10} justifyContent={'center'} alignItems='center' textAlign={'center'} height="100px" marginBottom={'8rem'}>
        {/* <LockOpenIcon sx={{fontSize:70}} style={{justifyContent:'center'}}/> */}
        <img src={Logo}/>
        <TextField 
            defaultValue={user}
            onChange={(e) => { setUser(String(e.target.value)); }} 
            id="txtLogin" label="Login" variant="outlined" style={{width:'100%', marginTop:'2rem'}}  
            helperText={ failureLogin ? "Login inválido" : ""}
            error={failureLogin}
        />
        <TextField 
            defaultValue={password}
            onChange={(e) => { setPassword(String(e.target.value)); }}
            id="txtSenha" type={'password'} label="Senha" variant="outlined" style={{width:'100%', marginTop:'.8rem'}}  
            helperText={ failurePassword ? "Senha inválida" : ""}
            error={failurePassword}
            onKeyDown={(e) => {handelKeyDown(e)}}
        />
        <Button variant="contained" style={{marginTop:'1rem', width:'100px'}}
            onClick={handleSignIn}
            >Entrar
        </Button>
        </Grid>
      </Grid>

     
  );
}