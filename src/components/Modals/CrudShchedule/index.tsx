import { Box, Button, Grid, MenuItem, Modal, TextField } from '@mui/material';
import { FormEvent, useEffect, useState } from 'react';
import CancelIcon from '@mui/icons-material/Cancel';
import './modal.css';

import { Api } from '../../../services/api';
import { CreateAndEditModalstyle as Modalstyle} from '../../../styles/Modals/StyledModal';

import { SnackbarProvider, useSnackbar } from 'notistack';

interface Schedule {
    aptemp_in_codigo: number,
    apt_dt_data: string,
    aptemp_st_empresa: string,
    apt_st_entrada: string,
    apt_st_intervalo: string,
    apt_st_saida: string,
    apt_st_diferenca:string,
    apt_st_atividade:string,
    apt_re_kmrodado: string,
    apt_re_pedagio: string,
    apt_st_origem_destino: string,
    apt_st_refeicao: string,
    apt_in_codigo: number
    
}

interface EditRegisterModalProps {
    isOpen: boolean;
    acao: string;
    requestClose: () => void;
    carregaDados: () => void;
    IdOfRegister: Schedule
}

interface RetornoDasEmpresas {
    aptemp_in_codigo: number,
    aptemp_st_empresa: string, 
}

export function CrudSchedule({isOpen, carregaDados, acao, requestClose, IdOfRegister} : EditRegisterModalProps){

    const { enqueueSnackbar } = useSnackbar()

    const [ retornoDasEmpresas , setRetornoDasEmpresas ] = useState<RetornoDasEmpresas[]>([]);

    const [InputData, setInputData] = useState('') ;
    const [Empresa, setEmpresa] = useState('');
    const [EmpresaId, setEmpresaId] = useState('');
    const [Entrada, setEntrada] = useState('');
    const [Intervalo, setIntervalo] = useState('');
    const [Saida, setSaida] = useState('');
    const [Atividade, setAtividade] = useState('') ;
    const [KmRodado, setKmRodado] = useState('');
    const [Pedagio, setPedagio] = useState('');
    const [OrigemDestino, setOrigemDestino] = useState('');
    const [Refeicao, setRefeicao] = useState(''); 

    async function handleSubmit(event: FormEvent){
        
        event.preventDefault();
        console.log('submit');
        const [ano, mes, dia] = InputData.split('-');
        const dataFormatada = `${dia}/${mes}/${ano}`
        
        if(acao == 'ED'){
        const resposta = await Api.put(`/Schedule/${IdOfRegister.apt_in_codigo}`, 
            {
                Data: dataFormatada,
                Empresa: Number(EmpresaId),
                Entrada,
                Intervalo,
                Saida,
                Atividade,
                KmRodado: Number(KmRodado.toString().replaceAll(',','.')),
                Pedagio: Number(Pedagio.toString().replaceAll(',','.')),
                OrigemDestino,
                Refeicao: Number(Refeicao.toString().replaceAll(',','.'))
            })
            .then((response) => {
                enqueueSnackbar('Operação realizado com sucesso!', { variant: 'success', autoHideDuration: 4000 }); 
                requestClose();
            })
            .catch(error => {
                enqueueSnackbar(`Deu ruim: ${error.message}`, { variant: 'error', autoHideDuration: 4000 }); 
            });

        }else if(acao == 'IN'){
            const resposta = await Api.post(`/Schedule`, 
            {
                Data: dataFormatada,
                Empresa: Number(EmpresaId),
                Entrada,
                Intervalo,
                Saida,
                Atividade,
                KmRodado: Number(KmRodado.toString().replaceAll(',','.')),
                Pedagio: Number(Pedagio.toString().replaceAll(',','.')),
                OrigemDestino,
                Refeicao: Number(Refeicao.toString().replaceAll(',','.'))
            })
            .then((response) => {
                enqueueSnackbar('Operação realizado com sucesso!', { variant: 'success', autoHideDuration: 4000 }); 
                requestClose();
            })
            .catch(error => {
                enqueueSnackbar(`Deu ruim: ${error.message}`, { variant: 'error', autoHideDuration: 4000 }); 
            });
        }else if(acao == 'EX'){
            const resposta = await Api.delete(`/Schedule/${IdOfRegister.apt_in_codigo}`)
            .then((response) => {
                enqueueSnackbar('Operação realizado com sucesso!', { variant: 'success', autoHideDuration: 4000 }); 
                requestClose();
            })
            .catch(error => {
                enqueueSnackbar(`Deu ruim: ${error.message}`, { variant: 'error', autoHideDuration: 4000 }); 
            });
        }
    }

    
    useEffect(() => {
        //retorna as empresas
        async function getCompanies(){
            await Api.get('Schedule/Companies').then(response => setRetornoDasEmpresas(response.data)).catch(e => console.log(e))

            if (acao  == 'ED' || acao  == 'EX'){
                
                const [dia, mes, ano] = IdOfRegister.apt_dt_data.split('/');
                setInputData(`${ano}-${mes}-${dia}`);
                setEmpresa(IdOfRegister.aptemp_st_empresa);
                setEmpresaId(IdOfRegister.aptemp_in_codigo.toString());
                setAtividade(IdOfRegister.apt_st_atividade);
                setKmRodado(IdOfRegister.apt_re_kmrodado);
                setPedagio(IdOfRegister.apt_re_pedagio);
                setRefeicao(IdOfRegister.apt_st_refeicao);
                setOrigemDestino(IdOfRegister.apt_st_origem_destino);
                setEntrada(IdOfRegister.apt_st_entrada);
                setIntervalo(IdOfRegister.apt_st_intervalo);
                setSaida(IdOfRegister.apt_st_saida);
            }else{
                setInputData(new Date().toLocaleDateString('pt-BR'));
                setEmpresa('');
                setEmpresaId('');
                setAtividade('');
                setKmRodado('');
                setPedagio('');
                setRefeicao('');
                setOrigemDestino('');
                setEntrada('');
                setIntervalo('');
                setSaida('');
            }
        }

        getCompanies();

       }, [carregaDados]);

    return (
        <Modal
            id={'crudModal'}
            open={isOpen}
            onClose={requestClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >                 
        <Box sx={Modalstyle} component="form" onSubmit={handleSubmit} style={{overflowY: 'auto', overflowX: 'hidden'}}>   
                    
                    <Grid  container rowSpacing={0} spacing={1} sx={{pr:5, pl:1, pt:1}}>
                        <Grid item md={11} xs={11} >
                            {acao == 'IN' &&
                              <h2>Novo Apontamento</h2>  
                            }
                            { acao == 'ED' &&
                             <h2>Editar Apontamento</h2> 
                            } 
                            { acao == 'EX' &&
                             <h2 style={{color: 'red', fontStyle: 'bold'}}>Deseja realmente excluir esse registro?</h2> 
                            } 
                        </Grid>
                        <Grid item md={1} xs={1} >
                        <Button onClick={requestClose}><CancelIcon></CancelIcon></Button>
                        </Grid>

                        <Grid item md={12} xs={12} >
                        </Grid>

                        <Grid item md={3} xs={12}>
                            <TextField
                                required
                                id="outlined-required"
                                label="Data"
                                type="date"
                                value={InputData}
                                onChange={e => setInputData(e.target.value)}
                                sx={{width: '100%'}}
                                focused
                            />
                        </Grid>
                        <Grid item md={3} xs={12}>                  
                            <TextField
                                id="outlined-select-currency"
                                select
                                label="Cliente"
                                value={EmpresaId}
                                onChange={e => setEmpresaId(e.target.value)}
                                sx={{width: '100%'}}
                            >
                            {retornoDasEmpresas.map((empresa) => (      
                            <MenuItem key={empresa.aptemp_in_codigo} value={empresa.aptemp_in_codigo}
                            >
                                {empresa.aptemp_st_empresa}
                            </MenuItem>  
                            ))}                   
                        </TextField>
                    </Grid>
                    <Grid item md={2} xs={12}>
                        <TextField
                            required
                            id="outlined-required"
                            label="Entrada"
                            type="time"//tipar depois
                            value={Entrada}
                            onChange={e => setEntrada(e.target.value)}
                            sx={{width: '100%'}}
                            focused
                        />
                    </Grid>
                    <Grid item md={2} xs={12}>
                        <TextField
                            required
                            id="outlined-required"
                            label="Intervalo"
                            type="time"//tipar depois
                            value={Intervalo}
                            onChange={e => setIntervalo(e.target.value)}
                            sx={{width: '100%'}}
                            focused
                        />
                    </Grid>
                    <Grid item md={2} xs={12}>
                        <TextField
                            required
                            id="outlined-required"
                            label="Saída"
                            type="time"//tipar depois
                            value={Saida}
                            onChange={e => setSaida(e.target.value)}
                            sx={{width: '100%'}}
                            focused
                        />
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <TextField
                            id="outlined-multiline-flexible"
                            label="Observações deslocamento"
                            multiline
                            maxRows={2}
                            value={OrigemDestino}
                            onChange={e => setOrigemDestino(e.target.value)}
                            sx={{width: '100%'}}
                        />
                    </Grid>
                    <Grid item md={2} xs={12}>
                        <TextField
                            required
                            id="outlined-required"
                            label="Deslocamento"
                            type="number"//tipar depois
                            value={KmRodado}
                            onChange={e => setKmRodado(e.target.value)}
                            sx={{width: '100%'}}
                        />
                    </Grid>
                    <Grid item md={2} xs={12}>
                        <TextField
                            required
                            id="outlined-required"
                            label="Pedágio"
                            type="number"//tipar depois
                            value={Pedagio}
                            onChange={e => setPedagio(e.target.value)}
                            sx={{width: '100%'}}
                        />
                    </Grid>
                    <Grid item md={2} xs={12}>
                        <TextField
                            required
                            id="outlined-required"
                            label="Refeição"
                            type="number"//tipar depois
                            value={Refeicao}
                            onChange={e => setRefeicao(e.target.value)}
                            sx={{width: '100%'}}
                        />
                    </Grid>
                    <Grid item md={12} xs={12}>
                        <TextField
                            id="outlined-multiline-flexible"
                            label="Descrição"
                            multiline
                            maxRows={5}
                            rows={5}
                            sx={{width: '100%'}}
                            value={Atividade}
                            onChange={e => setAtividade(e.target.value)}
                        />
                    </Grid>
                   
                </Grid>
                <Grid className='GridBottom'
                      width={'100%'} bottom={'10px'} 
                      container rowSpacing={2} spacing={2} sx={{pr:5, pl:1, pt:1}}

                      >
                        
                    <Grid item md={12} xs={12}>
                        <Button type="submit" variant="contained" style={{color:'white'}} sx={{ marginBottom:'10px', width: '100%', height: 60, color:'secondary.main'}}>
                            Confirmar                 
                        </Button>
                    </Grid>
                </Grid>
            </Box>         
        </Modal> 
    );
}