import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Box, Button, Grid, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
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
    conditions: []
    // ... other properties with their default values
  };

  // Initialize state with one empty action
  const [actions, setActions] = useState<CustomAction[]>([emptyAction]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedActionIndex, setSelectedActionIndex] = useState<number | null>(null);
  const [name, setName] = useState<string>();
  const [cclass, setCclass] = useState<string>();

  // const [conditions, setConditions] = useState<CustomCondition[]>([]);
  const actionsEnumOptions = Object.keys(ActionsEnum).filter(key => isNaN(Number(key)));
  const conditionsEnumOptions = Object.keys(ConditionsEnum).filter(key => isNaN(Number(key)));
  const operators = ['>', '<', '!', '=='];

  const downloadJson = () => {
    // Include the `cclass` in the data to download
    const dataToDownload = {
        class: cclass, // Include the class state value
        actions: actions
    };
    console.log(dataToDownload);

    // Convert data to JSON string
    const jsonString = JSON.stringify(dataToDownload, null, 2);

    // Create a Blob from the JSON string
    const blob = new Blob([jsonString], { type: "application/json" });
    
    // Create an anchor element and use it for downloading
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${name}.json`; // File name
    a.click();
    URL.revokeObjectURL(a.href); // Clean up
};

const addNewCondition = () => {
  if (selectedActionIndex !== null) {
    const newCondition: CustomCondition = {
      name: ConditionsEnum.HealthP,
      operator: '<',
      value: 60,
      valueString: '',
    };
    const updatedActions = [...actions];
    updatedActions[selectedActionIndex].conditions?.push(newCondition);
    setActions(updatedActions);
  }
};
const handleConditionChange = (actionIndex: number, conditionIndex: number, prop: string) => (event: any) => {
  if (actionIndex >= 0 && actionIndex < actions.length) {
    const updatedActions = [...actions];
    const conditions = updatedActions[actionIndex].conditions;
    if (conditionIndex >= 0 && conditionIndex < (conditions?.length ?? 0)) {
      if (conditions) {
        conditions[conditionIndex] = { ...conditions[conditionIndex], [prop]: event.target.value };
      }
      setActions(updatedActions);
    }
  }
};
  const handleSaveConditions = () => {
    handleCloseModal();
  };
  const handleOpenModal = (index: number) => {
    setSelectedActionIndex(index);
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleConditionTypeChange = (actionIndex: number, conditionIndex: number) => (event: any) => {
    if (actionIndex != null && actionIndex >= 0 && actionIndex < actions.length) {
      const updatedActions = [...actions];
      const conditions = updatedActions[actionIndex].conditions;
      if (conditionIndex >= 0 && conditionIndex < (conditions?.length ?? 0)) {
        // Directly update the name (type) of the condition
        if (conditions){
          conditions[conditionIndex] = { ...conditions[conditionIndex], name: event.target.value };
        }
        setActions(updatedActions);
      }
    }
  };
  
  const handleConditionOperatorChange = (actionIndex: number, conditionIndex: number) => (event: any) => {
    if (actionIndex != null && actionIndex >= 0 && actionIndex < actions.length) {
      const updatedActions = [...actions];
      const conditions = updatedActions[actionIndex].conditions;
      if (conditionIndex >= 0 && conditionIndex < (conditions?.length ?? 0)) {
        // Directly update the operator of the condition
        if (conditions){
        conditions[conditionIndex] = { ...conditions[conditionIndex], operator: event.target.value };
        }
        setActions(updatedActions);
      }
    }
  };
  // Function to add a new empty action
  const addNewAction = () => {
    setActions([...actions, {...emptyAction, conditions: [] }]);
  };
    // Function to handle type change
    const handleTypeChange = (index: number) => (event: any) => {
      const newActions = [...actions];
      const value = parseInt(ActionsEnum[event.target.value])
      newActions[index] = { ...newActions[index], type: value };
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
 
  return (
    <div className="App">
     <TableContainer component={Paper}>
    <Grid container spacing={2}>
  <Grid item xs={3}>
  <Box>Class </Box>        
  <Select
  sx={{ width: '125px' }}
  labelId="demo-simple-select-label"
  id="demo-simple-select"
  value={cclass}
  label="Type"
  onChange={(event) => setCclass(event.target.value)} // Use onChange to handle the selection
>
  <MenuItem value="Druid">Druid</MenuItem>
  <MenuItem value="Hunter">Hunter</MenuItem>
  <MenuItem value="Paladin">Paladin</MenuItem>
  <MenuItem value="Priest">Priest</MenuItem>
  <MenuItem value="Rogue">Rogue</MenuItem>
  <MenuItem value="Warlock">Warlock</MenuItem>
  <MenuItem value="Warrior">Warrior</MenuItem>
</Select>
  </Grid>
  <Grid item xs={3}>
  <Box>Name </Box>  <TextField 
  onChange={(event) => setName(event.target.value)}
  value={name}
/>
  </Grid>

</Grid>

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
                <TextField type="number" sx={{width:'75px'}} id="outlined-basic" value={action.slotIndex} label="Outlined" variant="outlined" 
                
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
      <Dialog open={openModal} onClose={handleCloseModal} fullWidth={true} maxWidth="xl">
        <DialogTitle>Manage Conditions</DialogTitle>
        <DialogContent>
          {/* Adjustments to the conditions table to use action-specific conditions */}
          {selectedActionIndex !== null &&
            actions[selectedActionIndex].conditions?.map((condition, index) => (
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
              <TableRow key={index}>
      <TableCell>
        <Select
          sx={{ width: '125px' }}
          labelId={`condition-type-select-label-${index}`}
          id={`condition-type-select-${index}`}
          value={condition.name}
          label="Type"
          onChange={handleConditionTypeChange(selectedActionIndex, index)} // Adjusted to pass both action and condition indexes
        >
          {conditionsEnumOptions.map((conditionValue, enumIndex) => (
            <MenuItem key={enumIndex} value={conditionValue}>
              {conditionValue}
            </MenuItem>
          ))}
        </Select>
      </TableCell>
      <TableCell>
        <Select
          sx={{ width: '125px' }}
          labelId={`condition-operator-select-label-${index}`}
          id={`condition-operator-select-${index}`}
          value={condition.operator}
          label="Operator"
          onChange={handleConditionOperatorChange(selectedActionIndex, index)} // Adjusted to pass both action and condition indexes
        >
          {operators.map(operator => (
            <MenuItem key={operator} value={operator}>
              {operator}
            </MenuItem>
          ))}
        </Select>
      </TableCell>
      <TableCell>
        <TextField 
          sx={{ width: '75px' }} 
          id={`condition-value-${index}`} 
          type="number"
          value={condition.value} 
          variant="outlined"
          onChange={handleConditionChange(selectedActionIndex, index, 'value')} // Adjusted for new structure
        />
      </TableCell>
      <TableCell>
        <TextField 
          sx={{ width: '75px' }} 
          id={`condition-valueString-${index}`} 
          value={condition.valueString} 
          variant="outlined" 
          onChange={handleConditionChange(selectedActionIndex, index, 'valueString')} // Adjusted for new structure
        />
      </TableCell>
      {/* Add more cells as needed */}
    </TableRow>
              </TableBody>








               























                </Table>
                </TableContainer>
            
              // Render condition inputs, updating condition within the selected action
            ))}
                     <Button 
                     variant="contained" 
                     onClick={addNewCondition}
                     style={{ marginTop: '10px' }}
                   >
                     Add New Condition
                   </Button>
          {/* Other components remain unchanged */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button onClick={handleSaveConditions}>Save</Button>
        </DialogActions>
        {/* Dialog actions unchanged */}
      </Dialog>
      <button onClick={downloadJson}>Download JSON</button>
    </TableContainer>
    </div>
  );
}

export default App;
