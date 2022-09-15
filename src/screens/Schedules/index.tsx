import * as React from 'react';
import Paper from '@mui/material/Paper';
import { Header } from '../../components/Header';
import { useEffect } from 'react';
import { DataGrid, GridColumns, GridRowId, ptBR } from '@mui/x-data-grid';
import { Box, Button, Grid, IconButton, Menu, MenuItem } from '@mui/material';
import { Api } from '../../services/api';
import { CrudSchedule } from '../../components/Modals/CrudShchedule';
import AddIcon from '@mui/icons-material/Add';
import PrevIcon from '@mui/icons-material/ArrowBackIosRounded';
import NextIcon from '@mui/icons-material/ArrowForwardIosRounded';
import MoreVert from '@mui/icons-material/MoreVert';
import LinearProgress from '@mui/material/LinearProgress';

import '../Schedules/style.css';
import { useNavigate } from "react-router-dom";
import { useSnackbar } from 'notistack';
import { addMonths } from 'date-fns';

import { styled } from '@mui/material/styles';

const StyledGridOverlay = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  '& .ant-empty-img-1': {
    fill: theme.palette.mode === 'light' ? '#aeb8c2' : '#262626',
  },
  '& .ant-empty-img-2': {
    fill: theme.palette.mode === 'light' ? '#f5f5f7' : '#595959',
  },
  '& .ant-empty-img-3': {
    fill: theme.palette.mode === 'light' ? '#dce0e6' : '#434343',
  },
  '& .ant-empty-img-4': {
    fill: theme.palette.mode === 'light' ? '#fff' : '#1c1c1c',
  },
  '& .ant-empty-img-5': {
    fillOpacity: theme.palette.mode === 'light' ? '0.8' : '0.08',
    fill: theme.palette.mode === 'light' ? '#f5f5f5' : '#fff',
  },
}));

function CustomNoRowsOverlay() {
  return (
    <StyledGridOverlay>
      <svg
        width="120"
        height="100"
        viewBox="0 0 184 152"
        aria-hidden
        focusable="false"
      >
        <g fill="none" fillRule="evenodd">
          <g transform="translate(24 31.67)">
            <ellipse
              className="ant-empty-img-5"
              cx="67.797"
              cy="106.89"
              rx="67.797"
              ry="12.668"
            />
            <path
              className="ant-empty-img-1"
              d="M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z"
            />
            <path
              className="ant-empty-img-2"
              d="M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z"
            />
            <path
              className="ant-empty-img-3"
              d="M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z"
            />
          </g>
          <path
            className="ant-empty-img-3"
            d="M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z"
          />
          <g className="ant-empty-img-4" transform="translate(149.65 15.383)">
            <ellipse cx="20.654" cy="3.167" rx="2.849" ry="2.815" />
            <path d="M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z" />
          </g>
        </g>
      </svg>
      <Box sx={{ mt: 1 }}>Nenhum lançamento</Box>
    </StyledGridOverlay>
  );
}

export function CustomFooterStatusComponent(props: {
  status: 'connected' | 'disconnected';
}) {
  return (
    <Box sx={{ pt: 3, pb:2 , display: 'flex' }}>  
      <Box sx={{position: 'absolute', bottom: 15, left: 850}}>R$</Box>
      <Box sx={{position: 'absolute', bottom: 15, left: 500}}>HH:HH</Box>
      <Box sx={{position: 'absolute', bottom: 15, left: 780}}>Km</Box>
      <Box sx={{position: 'absolute', bottom: 15, left: 1025}}>R$</Box>
      <Box sx={{position: 'absolute', bottom: 15, left: 10}}>Somatório:</Box>
    </Box>
    
    
  );
}


export default function Schedule() {
  const { enqueueSnackbar } = useSnackbar();
  const history = useNavigate();
  const [mes, setMes] = React.useState(0);
  const [txtMes, setTxtMes] = React.useState('');
 
  interface Data 
  {
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


  const [ registros, setRegistros ] = React.useState<Data[]>([]);
  const [ reg, setReg ] = React.useState<Data>({} as Data);

  

  const colunas:  GridColumns =[
       { field: 'apt_in_codigo', headerName: 'Id', width: 5, hide: true  }
      ,{ field: 'apt_dt_data', headerName: 'Dia', width: 100 }
      ,{ field: 'aptemp_in_codigo', headerName: 'Id Empresa', width: 0, hide: true }
      ,{ field: 'aptemp_st_empresa', headerName: 'Empresa', width: 150 }
      ,{ field: 'apt_st_entrada', headerName: 'Entrada', width: 80 }
      ,{ field: 'apt_st_intervalo', headerName: 'Intervalo', width: 80 }
      ,{ field: 'apt_st_saida', headerName: 'Saida', width: 80 }
      ,{ field: 'apt_st_diferenca', headerName: 'Horas', width: 80 }
      ,{ field: 'apt_st_atividade', headerName: 'Atividades', width: 200 }
      ,{ field: 'apt_re_kmrodado', headerName: 'KM', width: 70 }
      ,{ field: 'apt_re_pedagio', headerName: 'Pedágio R$', width: 100 }
      ,{ field: 'apt_st_origem_destino', headerName: 'Origem > Destino', width: 80 }
      ,{ field: 'apt_st_refeicao', headerName: 'Refeição R$', width: 90 }
      
      ,{
        field: " ",
        type: 'actions',
        headerName: 'Ações',
        width: 100,
        cellClassName: 'actions',
        // renderCell: (cellValues) => {
        //   return (
        //      <IconButton aria-label="more" onClick={(event) => {
        //            handleContextMenu(event, cellValues);
        //          }} >
        //      <MoreVert/>
        //      </IconButton>
        //   );
        // }
        getActions: ({ id }) => {
          return [
                 <IconButton aria-label="more" onClick={(event) => {
                       handleContextMenu(event, id);
                     }} >
                 <MoreVert/>
                 </IconButton>
          ];
        }
      }
  ];

  const [selectedRow, setSelectedRow] = React.useState<number>();

  const [contextMenu, setContextMenu] = React.useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  const handleContextMenu = (event: React.MouseEvent, cellValues: GridRowId) => {
    event.preventDefault();

    // trata se o click esta vindo do botao direito do mouse ou do proprio botao
    if(cellValues){
      setSelectedRow(Number(cellValues));
    }else{
      setSelectedRow(Number(event.currentTarget.getAttribute('data-id')));
    }
    
    setContextMenu(
      contextMenu === null
        ? { mouseX: event.clientX - 2, mouseY: event.clientY - 4 }
        : null,
    );
  };

  const [isOpenModal, setIsOpenModal] = React.useState(false);
  const [acaoModal, setAcaoModal] = React.useState('IN');

  const handleCloseModal = () => { 
    setIsOpenModal(false);
    carregaDados(0);
  }

  const handleClose = () => {
    setContextMenu(null);
  };

async function handleEditar(){
  console.log('editar');
    const linha = registros.find(data => data.apt_in_codigo === selectedRow);
    console.log(linha);
    if(linha){
      await setReg(linha);
      setAcaoModal('ED');
      setIsOpenModal(true);
    }
    handleClose();
  };

  async function handleExcluir(){
    const linha = registros.find(data => data.apt_in_codigo === selectedRow);
    if(linha){
      await setReg(linha);
      setAcaoModal('EX');
      setIsOpenModal(true);
    }
    handleClose();
  };

  function handleNovo(){
    setAcaoModal('IN');
    setIsOpenModal(true);
  }

  async function handleMes(pMes: number){
    carregaDados(pMes);
  }

  async function carregaDados(pMes: number){
    
    const m = mes + pMes;
    const dtMes = addMonths(new Date(), m);
    const Mes_Pesquisa = `${dtMes.toLocaleString('pt-BR', {month: '2-digit'})}_${dtMes.getFullYear()}`;
    const textoMes = `${dtMes.toLocaleString('pt-BR', {month: 'long'})}/${dtMes.getFullYear()}`;
    setTxtMes(textoMes);
    setMes(m);

    try{
    await Api.get(`Schedule/0/${Mes_Pesquisa}`)
    .then(response => {
      const reg = response.data;
      setRegistros([]);

      reg.map((item: Data) => {
        const dados = {
          aptemp_in_codigo: item.aptemp_in_codigo,
          apt_dt_data: new Date(item.apt_dt_data).toLocaleDateString('pt-BR'),
          aptemp_st_empresa: item.aptemp_st_empresa,
          apt_st_entrada: item.apt_st_entrada,
          apt_st_intervalo: item.apt_st_intervalo,
          apt_st_saida: item.apt_st_saida,
          apt_st_diferenca: item.apt_st_diferenca,
          apt_st_atividade: item.apt_st_atividade,
          apt_re_kmrodado: item.apt_re_kmrodado,
          apt_re_pedagio: item.apt_re_pedagio,
          apt_st_origem_destino: item.apt_st_origem_destino,
          apt_st_refeicao: item.apt_st_refeicao,
          apt_in_codigo: item.apt_in_codigo
      };
    
      setRegistros(oldState =>[... oldState, dados ]);
      }); 
    }
    )
    .catch(e => {
      console.log(e);
      if(e.response.status === 401){
        enqueueSnackbar('Sua sessão esgotou, por favor logue novamente', { variant: 'warning', autoHideDuration: 4000 }); 
        history('/SignIn');
      }
      else if(e.response.status === 404){
        enqueueSnackbar(`Nenhum lançamento encontrado para ${textoMes} `, { variant: 'warning', autoHideDuration: 4000 }); 
        setRegistros([]);
      }
     
    });
    }catch(e){
      console.log(e);
    }finally{
    }
  }


  useEffect(() => {
    carregaDados(0);
  }, []);


  return (
    <Header titulo='Agenda'>
    <Paper sx={{ width: '100%', height:'100%', minHeight:'87vh', overflow: 'hidden', marginTop: '5rem' }}>
    <Box sx={{ height: '83vh', width: '100%' }} style={{padding:'10px'}}>
    <Grid container spacing={2} style={{marginBottom:'5px'}}>
      <Grid item xs={12} md={2}>
        <Button variant="outlined" onClick={handleNovo} startIcon={<AddIcon />}>
          Novo
        </Button>
      </Grid>
      <Grid className='IconButton' item xs={2} md={2}>
        <IconButton aria-label="prev" onClick={() => handleMes(-1)} >
          <PrevIcon />
        </IconButton>
      </Grid>
      <Grid className='IconButton' item xs={8} md={4} textTransform={'capitalize'} textAlign='center'>
          <label className='labell'>{txtMes}</label>
      </Grid>
      <Grid className='IconButton' item xs={2} md={2}>
        <IconButton aria-label="next" onClick={() => handleMes(1)}>
          <NextIcon />
        </IconButton>
      </Grid>

      <Grid item xs={0} md={2}>
      </Grid>
    </Grid>
      

    <DataGrid
        columns={colunas}
        rows={registros}
        localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}

        componentsProps={{
          row: {
            onContextMenu: handleContextMenu,
            style: { cursor: 'context-menu' },
          },
        }}

        getRowId={(row) => row.apt_in_codigo}
        autoPageSize={false}
        // getRowHeight={() => 'auto'}
        components={{
          //Footer: CustomPagination,
          NoRowsOverlay: CustomNoRowsOverlay,
          LoadingOverlay: LinearProgress,
          Footer: CustomFooterStatusComponent,
        }}
        pageSize={30}
        
      />
      <Menu
        open={contextMenu !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
        componentsProps={{
          root: {
            onContextMenu: (e) => {
              e.preventDefault();
              handleClose();
            },
          },
        }}
      >
        <MenuItem onClick={handleEditar}>Editar</MenuItem>
        <MenuItem onClick={handleExcluir}>Excluir</MenuItem>
      </Menu>
      <CrudSchedule acao={acaoModal} carregaDados={handleEditar} IdOfRegister={reg} isOpen={isOpenModal} requestClose={handleCloseModal} />
      </Box>
    </Paper>
    </Header>
  );
}