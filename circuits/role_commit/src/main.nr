use dep::std;

fn main(
    role: u4,
    salt: u32
) -> pub Field {
    constrain role < 2;
    let hash = std::hash::pedersen([role as Field, salt as Field]);
    hash[0]
}


