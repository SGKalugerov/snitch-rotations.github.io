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
    conditions: [{
      name: ConditionsEnum.EnemyCasting,
      operator: "!",
      value: 0,
      valueString: ''
    }]
    // ... other properties with their default values
  };

  // Initialize state with one empty action
  const [actions, setActions] = useState<CustomAction[]>(() => {
    const savedActions = localStorage.getItem('actions');
    return savedActions ? JSON.parse(savedActions) : [emptyAction];
  });
  const [openModal, setOpenModal] = useState(false);
  const [selectedActionIndex, setSelectedActionIndex] = useState<number | null>(null);
  const [name, setName] = useState<string>(() => {
    return localStorage.getItem('name') || '';
  });
  const [cclass, setCclass] = useState(() => {
    return localStorage.getItem('cclass') || '';
  });
  // const [conditions, setConditions] = useState<CustomCondition[]>([]);
  const actionsEnumOptions = Object.keys(ActionsEnum).filter(key => isNaN(Number(key)));
  const conditionsEnumOptions = Object.keys(ConditionsEnum).filter(key => isNaN(Number(key)));
  const operators = [' ', '>', '<', '!', '=='];
  const [draggedIndex, setDraggedIndex] = useState<number>(0);
  useEffect(() => {
    localStorage.setItem('actions', JSON.stringify(actions));
  }, [actions]);
  useEffect(() => {
    localStorage.setItem('name', name);
  }, [name]);

  useEffect(() => {
    localStorage.setItem('cclass', cclass);
  }, [cclass]);
  const handleDragStart = (event: any, index: number) => {
    setDraggedIndex(index);
  };
  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }
  
    const reader = new FileReader();
    reader.onload = (e) => {
        const result = e.target?.result ?? "";
        if (typeof result === "string") {
          try {
            const json = JSON.parse(result);
            if(json.actions && json.class) {
              setActions(json.actions);
              setCclass(json.class);
            } else {
              console.error("Invalid file format or structure.");
            }
          } catch (err) {
            console.error("Error parsing JSON file:", err);
          }
        } else {
          console.error("File content is not a string.");
        }
        event.target.value = ''
    };
    reader.readAsText(file);
  };
  const wipeAll = () => {
    setActions([{...emptyAction, conditions: [] }]);
    setName('');
  }
  const handleDrop = (event: any, dropIndex:number) => {
  
    const newActions = [...actions];
    const [reorderedItem] = newActions.splice(draggedIndex, 1);
    newActions.splice(dropIndex, 0, reorderedItem);
  
    setActions(newActions);
    setDraggedIndex(0); // Reset the dragged index
  };
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
      operator: ' ',
      value: 60,
      valueString: '',
    };
    const updatedActions = [...actions];
    updatedActions[selectedActionIndex]?.conditions?.push(newCondition);
    setActions(updatedActions);
  }
};
const handleConditionChange = (actionIndex: number, conditionIndex: number, prop: string) => (event: any) => {
  const updatedActions = [...actions];
  const conditions = updatedActions[actionIndex]?.conditions;
  if (conditionIndex >= 0 && conditionIndex < (conditions?.length ?? 0)) {
    let value = event.target.value;
    // Check if prop is 'value' and convert string to number
    if (prop === 'value') {
      value = parseInt(event.target.value, 10); // Use parseInt for integers
      if (isNaN(value)) {
        value = 0; // Default or error handling
      }
    }
    if (conditions) {
      conditions[conditionIndex] = { ...conditions[conditionIndex], [prop]: value };
    }
    setActions(updatedActions);
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
      const conditions = updatedActions[actionIndex]?.conditions;
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
      const conditions = updatedActions[actionIndex]?.conditions;
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
      newActions[index] = { ...newActions[index], type: event.target.value };
      setActions(newActions);
    };

    
    const deleteAction = (index: number) => {
      const newActions = actions.filter((_, actionIndex) => actionIndex !== index);
      
      const updatedActions = newActions.map(action => ({
        ...action,
        conditions: action?.conditions ? [...action?.conditions] : [],
      }));
     if(updatedActions.length < 1){
      setActions([...updatedActions, {...emptyAction, conditions: [] }]);
     } else {
      setActions(updatedActions);

     }

    };
  const handleActionChange = (index: number, prop: any) => (event: any) => {
    const newActions = [...actions];
    let value = event.target.value;
    if (prop === 'slotIndex') {
      value = parseInt(event.target.value);
    }
    if (prop === 'cooldown') {
      value = parseInt(event.target.value);
    }
    if (prop === 'tapTwice') {
      value = event.target.checked;
    }
    if (prop === 'stepBack') {
      value = event.target.checked;
    }
    if (prop === 'hasCastBar') {
      value = event.target.checked;
    }
    newActions[index] = { ...newActions[index], [prop]: value };
    setActions(newActions);
  };
  const deleteCondition = (actionIndex: number, conditionIndex: number) => {
    const updatedActions = [...actions]; // Create a shallow copy of the actions array
    const conditions = updatedActions[actionIndex]?.conditions; // Get a reference to the conditions array of the action to be updated
  
    if (conditions && conditionIndex >= 0 && conditionIndex < conditions?.length) {
      conditions.splice(conditionIndex, 1); // Remove the condition at the specified index
      setActions(updatedActions); // Update the state with the modified actions array
    }
  };
  return (
    <div className="App">
     <TableContainer component={Paper} sx={{backgroundColor: 'darkgray'}}>
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
  <MenuItem value="Shaman">Shaman</MenuItem>
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
              <TableRow key={index}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, index)}>
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
                <TextField sx={{width:'75px'}} type={'checkbox'} id="outlined-basic" value={action.stepBack ? 'Yes' : 'No'} variant="outlined" 
  onChange={handleActionChange(index, 'stepBack')}/>
                  </TableCell>
                <TableCell align="right">
                <TextField type={'checkbox'} sx={{width:'75px'}} id="outlined-basic" value={action.hasCastBar ? 'Yes' : 'No'} variant="outlined" 
  onChange={handleActionChange(index, 'hasCastBar')}/>
                  </TableCell>
                <TableCell align="right">
                <TextField sx={{width:'75px'}} type={'checkbox'} id="outlined-basic" value={action.tapTwice ? 'Yes' : 'No'} variant="outlined" 
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
      <Dialog  sx={{backgroundColor: 'darkgray'}} open={openModal} onClose={handleCloseModal} fullWidth={true} maxWidth="xl">
        <DialogTitle>Manage Conditions</DialogTitle>
        <DialogContent>
          {/* Adjustments to the conditions table to use action-specific conditions */}
          {selectedActionIndex !== null &&
            actions[selectedActionIndex]?.conditions?.map((condition, index) => (
              <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="conditions table">
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Operator</TableCell>
                    <TableCell>Value</TableCell>
                    <TableCell>Value String</TableCell>
                    {/* Add more headers as needed */}
                  </TableRow>
                </TableHead>

              <TableBody>
              <TableRow key={index}>
                <TableCell sx={{width:100}}>     <Button variant="outlined" color="error" onClick={() => deleteCondition(selectedActionIndex, index)}>
                    Delete
                  </Button></TableCell>
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
          defaultValue={operators[0]}
          onChange={handleConditionOperatorChange(selectedActionIndex, index)} // Adjusted to pass both action and condition indexes
        >
          {operators.map(operator => (
            <MenuItem sx={{height:40}} key={operator} value={operator}>
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
    <Button onClick={() => wipeAll()}>Wipe</Button>
    <Button onClick={() => document.getElementById('fileInput')?.click()}>Upload JSON</Button>
    <Box>
    light leather;medium leather;thick leather;heavy hide;thick hide;turtle meat;wool cloth;silk cloth;mageweave cloth;iridescent pearl;small lustrous pearl;spider silk;goretusk liver;goretusk snout;great goretusk snout;stringy vulture meat;lean wolf flank;ruiner leather scraps;mystery meat;bear meat;big bear meat;elemental air;elermental fire;green leather bag;blue leather bag;large knapsack;linen cloth;lion meat;small brown bag;small blue bag;small green bag;small red bag;jade;felcloth;turtle scale;small flame sac;runecloth;rugged leather;grave moss;giant egg;tigerseye;shadowgem;lesser moonstone;moss agate;citrine;aquamarina;star ruby;pristine black diamond;small blue pouch;small red pouch;small green pouch;small black pouch;strider meat;white leather bag;large venom sac;thunder lizard tail;healing;recipe;chunk of boar meat;sharp claw;bag;sack;pack;silk;large fang;elemental earth;red wolf meat;wicked claw;scorpid scale;heavy leather;tender wolf meat;vibrant plume;tender wolf meat;large venom sac;rugged leather;rugged hide;essence of fire;living essence;golden pearl;zesty clam meat;black pearl;felcloth;essence of water;spider's silk;shadow silk;stringy wolf meat;bear meat;runecloth;solid stone;elemental earth;turtle scale;blue dragonscale;black dragonscale;black whelp scale
    </Box>
<input
  type="file"
  id="fileInput"
  style={{ display: 'none' }}
  accept=".json"
  onChange={handleFileChange}
/>
    </div>
  );
}

export default App;
