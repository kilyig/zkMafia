use dep::std;
// simply create the hash value that acts as a committment to
// your role. The task of determining who gets wthich role is 
// a separate task/problem. We assume here that the roles are
// already distributed, possibly using a mental poker protocol.
fn main(
    role: u4,
    salt: u32
) -> pub Field {
    constrain role < 2;
    let roleHash = std::hash::pedersen([role as Field, salt as Field]);
    roleHash[0]
}


