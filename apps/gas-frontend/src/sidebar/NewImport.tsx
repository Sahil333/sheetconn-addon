import React, { useEffect, useState } from 'react';
import { Box, Typography, Divider, IconButton, Menu, MenuItem, Avatar, ButtonBase, Button } from '@mui/material';
import { useRootContext } from './RootWindow';
import postgesIconUrl from '../assets/postgresql.png';
import AddIcon from '@mui/icons-material/Add';
import { Link, createSearchParams, useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import { textShortener } from 'src/lib/util';

interface Connection {
    id: string;
    name: string;
    default: boolean;
    imageUrl?: string;
}

interface Connector {
    id: string;
    name: string;
    icon: string;
    category: string;
    add_path: string;
    import_path: string;
    connections: Connection[];
}

const localConnectors: Connector[] = [
    {
        id: "1",
        name: "PostgreSQL",
        icon: postgesIconUrl,
        category: "Databases",
        add_path: "/config/add/postgres",
        import_path: "/import/postgres",
        connections: [
            {
                id: "1",
                name: "Connection 1",
                default: true,
                imageUrl: "https://lh3.googleusercontent.com/-g0CwCUerYP8/AAAAAAAAAAI/AAAAAAAAAAA/ALKGfkkvpZLjW2PsKFtsFfslnSK8zV5Z6A/s48-c/photo.jpg",
            },
            {
                id: "2",
                name: "Connection 2",
                default: false,
            }
        ]
    }
];

const deleteConnection = (connectorId: string, connectionId: string) => {
    console.log("Deleting connection with id: ", connectionId);
    localConnectors.forEach((connector) => {
        if (connector.id === connectorId) {
            connector.connections = connector.connections.filter((conn) => conn.id !== connectionId);
        }
    });
}

export default function ConnectorsList() {
    const { onTitleChange } = useRootContext();
    const [connectors, setConnectors] = useState<Connector[]>([]);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedConnections, setSelectedConnections] = useState<Record<string, Connection>>({});
    const navigate = useNavigate();

    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
        event.stopPropagation();
    };

    const handleMenuCloseProgrammatically = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(null);
        event.stopPropagation();
    }

    const handleMenuClose = (event : any, reason: string) => {
        setAnchorEl(null);
        event?.stopPropagation();
    };

    useEffect(() => {
        onTitleChange("New Import");
        setConnectors(localConnectors);
        const defaultConn: Record<string, Connection> = localConnectors.reduce((acc, connector) => {
            if (connector.connections && connector.connections.length > 0) {
                const defaultConnection = connector.connections.find((conn) => conn.default);
                if (defaultConnection) {
                    acc[connector.id] = defaultConnection;
                } else {
                    acc[connector.id] = connector.connections[0];
                }
            }
            return acc;
        }, {} as Record<string, Connection>);
        setSelectedConnections(defaultConn);
    }, []);

    const groupedConnectors = connectors.reduce((acc, connector) => {
        if (!acc[connector.category]) {
            acc[connector.category] = [];
        }
        acc[connector.category].push(connector);
        return acc;
    }, {} as Record<string, Connector[]>);

    const connectorsMap = connectors.reduce((acc, connector) => {
        acc[connector.id] = connector;
        return acc;
    }, {} as Record<string, Connector>);

    function handleDelete(connectorId: string, connectionId: string): React.MouseEventHandler<HTMLButtonElement> | undefined {
        return (event) => {
            // Use react-query to delete the connection and update the state
            deleteConnection(connectorId, connectionId);
            setConnectors(localConnectors);
            if(selectedConnections && selectedConnections[connectorId].id === connectionId) {
                setSelectedConnections({
                    ...selectedConnections,
                    [connectorId]: connectorsMap[connectionId].connections[0] || null,
                } as Record<string, Connection>);
            } else {
                // TODO: separate the menu component rendering from the connection selection
                setSelectedConnections({...selectedConnections});
            }
            if(connectors.find((c) => c.id === connectorId)?.connections.length === 0) {
                handleMenuCloseProgrammatically(event);
            }
            event.stopPropagation();
        }
    }
    
    function handleConnectionSelection(id: string, id1: string): React.MouseEventHandler<HTMLLIElement> | undefined {
        return (event) => {
            setSelectedConnections({
                    ...selectedConnections,
                    [id]: connectors.find((c) => c.id === id)?.connections.find((c) => c.id === id1) || null,
                } as Record<string, Connection>);
            handleMenuCloseProgrammatically(event);
        }
    }

    function handleAdd(id: string): React.MouseEventHandler<HTMLButtonElement> | undefined {
        return () => {
            console.log("Adding connection for connector with id: ", id);
            navigate(connectors.find((c) => c.id === id)?.add_path || '/');
        }
    }


    function handleAllConnectionDelete(id: string): React.MouseEventHandler<HTMLButtonElement> | undefined {
        return () => {
            console.log("Deleting all connections for connector with id: ", id);
        }
    }

    function handleConnectorImport(id: string): React.MouseEventHandler<HTMLButtonElement> | undefined {
        return () => {
            if(selectedConnections && selectedConnections[id]) {
                navigate({pathname: connectorsMap[id].import_path, search: createSearchParams({connection_id: selectedConnections[id].id, connector_id: id}).toString()});
            } else {
                navigate(connectorsMap[id].add_path);
            }
        }
    }

    return (
        <Box sx={{ mt: 2, ml: 2, mr: 2 }}>
            {Object.entries(groupedConnectors).map(([category, connectors]) => (
                <Box key={category} sx={{ marginBottom: '16px' }}>
                    <Divider >{category}</Divider>
                    {connectors.map((connector) => (
                        <ButtonBase
                            key={connector.id}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                p: 1,
                                borderRadius: '8px',
                                border: '1px solid #ddd',
                                my: 1,
                                flexGrow: 1,
                                width: '100%',
                            }}
                            onClick={handleConnectorImport(connector.id)}
                            disableRipple
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', ml: 1, mr: 2 }}>
                                <img src={connector.icon} alt={connector.name} style={{ width: '32px', height: '32px', marginRight: '8px' }} />
                                <Typography variant="caption">{connector.name}</Typography>
                            </Box>
                            {connector.connections && (
                                <Box>
                                    {selectedConnections && selectedConnections[connector.id] && (
                                        <ButtonBase
                                            onClick={(event) => handleClick(event)}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                border: '1px solid',
                                                borderRadius: '25px',
                                                padding: '5px',
                                                cursor: 'pointer',
                                                height: '30px',
                                            }}
                                        >
                                            <Avatar sx={{ width: 25, height: 25, marginRight: 1}}>
                                                <img src={selectedConnections[connector.id].imageUrl} alt="icon" style={{objectFit: 'cover', width: '100%', height: '100%'}}/>
                                            </Avatar>
                                            <Typography variant="caption">{textShortener(selectedConnections[connector.id].name, 10)}</Typography>
                                        </ButtonBase>
                                    )}
                                    <Menu
                                        id="basic-menu"
                                        anchorEl={anchorEl}
                                        open={open}
                                        onClose={handleMenuClose}
                                        MenuListProps={{
                                            'aria-labelledby': 'basic-button',
                                        }}
                                        PaperProps={{
                                            style: {
                                                borderRadius: '15px',
                                            },
                                        }}
                                    >

                                        {connector.connections.map((connection: Connection) => (
                                            <MenuItem key={connection.id} onClick={handleConnectionSelection(connector.id, connection.id)}>
                                                <Box
                                                    sx = {{
                                                        display: 'flex',
                                                        flexDirection: 'row',
                                                        justifyContent: 'space-around',
                                                        alignItems: 'center',
                                                        flexGrow: 1,
                                                    }}
                                                >
                                                <Box sx={{flexDirection: 'row', display: "flex"}}>
                                                    <Avatar sx={{width: 25, height: 25, marginRight: 1}}>
                                                        <img src={connection.imageUrl} alt="icon" style={{objectFit: 'cover', width: '100%', height: '100%'}} />
                                                    </Avatar>
                                                <Typography variant="caption">{connection.name}</Typography>
                                                </Box>
                                                <IconButton edge="end" aria-label="delete" onClick={handleDelete(connector.id, connection.id)} style={{ color: '#b20000' }}>
                                                    <DeleteIcon /> {/* Use the imported DeleteIcon component */}
                                                </IconButton>
                                                </Box>
                                            </MenuItem>
                                        ))}
                                        <Box display="flex" flexDirection="column" sx={{
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                        }}>
                                         <MenuItem key="add-connection" onClick={handleMenuCloseProgrammatically} sx = {{ 
                                                                                        '&:hover': { 
                                                                                            backgroundColor: 'transparent', 
                                                                                            textDecoration: 'none',
                                                                                        },
                                                                                    }} disableRipple>
                                         
                                            <Button variant="contained" color="primary" onClick={handleAdd(connector.id)} startIcon={<AddIcon />}>
                                            <Typography variant="caption">Add Connection</Typography>
                                            </Button>
                                        </MenuItem>

                                        <MenuItem key="" onClick={handleMenuCloseProgrammatically} sx = {{ 
                                                                                        '&:hover': { 
                                                                                            backgroundColor: 'transparent', 
                                                                                            textDecoration: 'none',
                                                                                        },
                                                                                    }} disableRipple>
                                        <Button variant="contained" color="secondary" onClick={handleAllConnectionDelete(connector.id)} startIcon={<DeleteIcon />}>
                                            <Typography variant="caption">Delete All</Typography>
                                        </Button>
                                        </MenuItem>
                                        </Box>

                                    </Menu>
                                </Box>
                            )} { connector.connections.length === 0 && (
                                <Link to={connector.add_path} onClick={(e) => {e.stopPropagation()}}>
                                    <IconButton>
                                        <AddIcon />
                                    </IconButton>
                                </Link>
                            )}
                        </ButtonBase>
                    ))}
                </Box>
            ))}
        </Box>
    );
}
