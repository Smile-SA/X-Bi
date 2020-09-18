export function generateData()
{
    let nbr = Math.floor(Math.random() * 10);
    const data =  {
        total: nbr,
        results: []
    }
    const types = ['type 1', 'type 2', 'type 3','type 4', 'type 5', 'type 6','type 7', 'type 8', 'type 9', 'type 10'];
    for(let i = 0; i < nbr;i++) {
        let index = Math.floor(Math.random() * 10);
        data.results.push(
            {frame_begin: `Sun, 05 Apr 2020 0${i}:00:00 GMT`, frame_price: Math.random() * 10, node: types[index]}
        );
    }
    return data;
}