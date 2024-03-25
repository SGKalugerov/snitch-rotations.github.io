import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Button, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import Paper from '@mui/material/Paper';
import { ActionClassificationEnum, ActionsEnum, ConditionsEnum, CustomAction, CustomCondition } from './Types';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { createStyles, makeStyles } from '@mui/material/styles';



function App() {
  const emptyAction: CustomAction = {
    name: 'Shadow Bolt',
    keybind: '1',
    slotIndex: 1,
    type: ActionsEnum.Dps, // Assign a default value or leave empty if it's a string
    cooldown: 0,
    stepBack: false,
    hasCastBar: false,
    tapTwice: false,
    classification: ActionClassificationEnum.Spell,
    conditions: []
    // ... other properties with their default values
  };
  // const emptyCondition: CustomCondition = {
  //   name: ConditionsEnum.HealthP,
  //   operator: '<',
  //   value: 60 
  // }
  // Initialize state with one empty action
  const [actions, setActions] = useState<CustomAction[]>([emptyAction]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedActionIndex, setSelectedActionIndex] = useState<number | null>(null);
  const [conditions, setConditions] = useState<CustomCondition[]>([]);
  const actionsEnumOptions = Object.keys(ActionsEnum).filter(key => isNaN(Number(key)));
  const conditionsEnumOptions = Object.keys(ConditionsEnum).filter(key => isNaN(Number(key)));
  const operators = ['>', '<', '!', '=='];

  // useEffect(() => {
  //   if (selectedActionIndex != null) {
  //     setConditions([...actions[selectedActionIndex].conditions]);
  //   }
  // }, [selectedActionIndex, actions]);
  const downloadJson = () => {
    // Extract data from state (e.g., `actions` state)
    const dataToDownload = { actions };
console.log({actions})
    // Convert data to JSON string
    const jsonString = JSON.stringify(dataToDownload, null, 2);

    // Create a Blob from the JSON string
    const blob = new Blob([jsonString], { type: "application/json" });
    
    // Create an anchor element and use it for downloading
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'actions.json'; // File name
    a.click();
    URL.revokeObjectURL(a.href); // Clean up
};

  const addNewCondition = () => {
    const newCondition: CustomCondition = {
      // Set up a blank or default condition structure
      name: ConditionsEnum.HealthP, // Replace with default or blank values
      operator: '<',
      value: 60,
      valueString: '',
      // ... other properties
    };
    setConditions([...conditions, newCondition]);
  };
  const handleConditionChange = (index: number, prop: string) => (event: any) => {
    const newConditions = [...conditions];
    newConditions[index] = { ...newConditions[index], [prop]: event.target.value };
    setConditions(newConditions);
  };
  const handleSaveConditions = () => {
    if (selectedActionIndex != null) {
      const updatedActions = [...actions];
      updatedActions[selectedActionIndex].conditions = [...conditions];
      setActions(updatedActions);
    }
    handleCloseModal();
  };
  const handleOpenModal = (index: number) => {
    setSelectedActionIndex(index);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // Function to add a new empty action
  const addNewAction = () => {
    setActions([...actions, {...emptyAction, conditions: [] }]);
  };
    // Function to handle type change
    const handleTypeChange = (index: number) => (event: any) => {
      const newActions = [...actions];
      newActions[index] = { ...newActions[index], type: event.target.value };
      setActions(newActions);
    };
    
  const deleteAction = (index: number) => {
    const newActions = actions.filter((_, actionIndex) => actionIndex !== index);
    setActions(newActions);
  };
  const handleActionChange = (index: number, prop: any) => (event: any) => {
    const newActions = [...actions];
    newActions[index] = { ...newActions[index], [prop]: event.target.value };
    setActions(newActions);
  };
  const handleConditionTypeChange = (index: number) => (event: any) => {
    const newConditions = [...conditions];
    newConditions[index] = { ...newConditions[index], name: event.target.value };
    setConditions(newConditions);
  };

  const handleConditionOperatorChange = (index: number) => (event: any) => {
    const newConditions = [...conditions];
    newConditions[index] = { ...newConditions[index], operator: event.target.value };
    setConditions(newConditions);
  };
  return (
    <div className="App">
     <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650, maxWidth: 1500 }} aria-label="simple table">
        <TableHead>
          <TableRow>
          <TableCell align="right"></TableCell>
            <TableCell align="right">Name</TableCell>
            <TableCell align="right">Keybind</TableCell>
            <TableCell align="right">Slot Index</TableCell>
            <TableCell align="right">Type</TableCell>
            <TableCell align="right">Cooldown</TableCell>
            <TableCell align="right">Step back</TableCell>
            <TableCell align="right">Has cast bar</TableCell>
            <TableCell align="right">Tap twice</TableCell>
            <TableCell align="right">Conditions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {actions.map((action, index) => (
              <TableRow key={index}>
                <TableCell align="right">
                  <Button variant="outlined" color="error" onClick={() => deleteAction(index)}>
                    Delete
                  </Button>
                </TableCell>
                <TableCell align="right">
                <TextField sx={{width:'200px'}} id="outlined-basic" value={action.name} label="Outlined" variant="outlined" 
                
  onChange={handleActionChange(index, 'name')}/>
                  </TableCell>
                <TableCell align="right">
                <TextField sx={{width:'75px'}} id="outlined-basic" value={action.keybind} label="Outlined" variant="outlined" 
                
  onChange={handleActionChange(index, 'keybind')}/>
                  </TableCell>
                <TableCell align="right">
                <TextField sx={{width:'75px'}} id="outlined-basic" value={action.slotIndex} label="Outlined" variant="outlined" 
                
  onChange={handleActionChange(index, 'slotIndex')}/>
                </TableCell>
                <TableCell align="right">
                <Select
                sx={{width:'125px'}}
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={action.type}
        label="Type"
        onChange={handleTypeChange(index)} // Pass index here
      >
        {actionsEnumOptions.map((actionValue, actionIndex) => (
          <MenuItem key={actionIndex} value={actionValue}>
            {actionValue}
          </MenuItem>
        ))}
      </Select>
              </TableCell>
                <TableCell align="right">
                <TextField sx={{width:'75px'}} id="outlined-basic" value={action.cooldown} variant="outlined" 
  onChange={handleActionChange(index, 'cooldown')}/>
                 </TableCell>
                <TableCell align="right">
                <TextField sx={{width:'75px'}} id="outlined-basic" value={action.stepBack ? 'Yes' : 'No'} variant="outlined" 
  onChange={handleActionChange(index, 'stepBack')}/>
                  </TableCell>
                <TableCell align="right">
                <TextField sx={{width:'75px'}} id="outlined-basic" value={action.hasCastBar ? 'Yes' : 'No'} variant="outlined" 
  onChange={handleActionChange(index, 'hasCastBar')}/>
                  </TableCell>
                <TableCell align="right">
                <TextField sx={{width:'75px'}} id="outlined-basic" value={action.tapTwice ? 'Yes' : 'No'} variant="outlined" 
  onChange={handleActionChange(index, 'tapTwice')}/>
                 </TableCell>
                <TableCell align="right">
                <Button variant="outlined" onClick={() => handleOpenModal(index)}>
                  Manage Conditions
                </Button>
              </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <Button onClick={addNewAction}>Add</Button>
      <Dialog open={openModal} onClose={handleCloseModal}  fullWidth={true} maxWidth="xl">
        <DialogTitle>Manage Conditions</DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="conditions table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Operator</TableCell>
                  <TableCell>Value</TableCell>
                  <TableCell>Value String</TableCell>
                  {/* Add more headers as needed */}
                </TableRow>
              </TableHead>
              <TableBody>
                {conditions.map((condition, index) => (
                  <TableRow key={index}>
                    <TableCell>
                    <Select
                sx={{width:'125px'}}
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={condition.name}
        label="Type"
        onChange={handleConditionTypeChange(index)} // Pass index here
      >
        {conditionsEnumOptions.map((conditionValue, conditionIndex) => (
          <MenuItem key={conditionIndex} value={conditionValue}>
            {conditionValue}
          </MenuItem>
        ))}
      </Select>
                    </TableCell>
                    <TableCell>
                    <Select
                sx={{width:'125px'}}
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={condition.name}
        label="Type"
        onChange={handleConditionOperatorChange(index)} // Pass index here
      >
        {operators.map(operator => (
          <MenuItem key={operator} value={operator}>
            {operator}
          </MenuItem>
        ))}
      </Select>
  </TableCell>
                    <TableCell>
                    <TextField sx={{width:'75px'}} id="outlined-basic" value={condition.value} variant="outlined" 
  onChange={handleConditionChange(index, 'value')}/>
  </TableCell>
                    <TableCell>
                    <TextField sx={{width:'75px'}} id="outlined-basic" value={condition.valueString} variant="outlined" 
  onChange={handleConditionChange(index, 'valueString')}/></TableCell>
                    {/* Add more cells as needed */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Button 
            variant="contained" 
            onClick={addNewCondition}
            style={{ marginTop: '10px' }}
          >
            Add New Condition
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button onClick={handleSaveConditions}>Save</Button>
        </DialogActions>
      </Dialog>
      <button onClick={downloadJson}>Download JSON</button>
    </TableContainer>
    </div>
  );
}

export default App;
