package com.example.backend.repository;
import com.example.backend.user.*;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {

    List<User> findByRole(Role role);
    Optional<User> findByUsername(String username);
    List<User> findByWork(Work work);
    Optional<User> findByMatricule(String matricule);
}
