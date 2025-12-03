package com.example.backend.services;

import com.example.backend.Equipment.Equipment;
import com.mongodb.client.gridfs.model.GridFSFile;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.data.mongodb.gridfs.GridFsOperations;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.query.Update;
import static org.springframework.data.mongodb.core.query.Criteria.where;
import static org.springframework.data.mongodb.core.query.Query.query;

import static org.springframework.data.mongodb.core.query.Criteria.where;
import static org.springframework.data.mongodb.core.query.Query.query;

@Service
public class DocumentService {
    @Autowired
    private MongoTemplate mongoTemplate;
    @Autowired
    private GridFsOperations gridFsOperations;

    public String uploadFile(MultipartFile file) throws IOException {
        ObjectId fileId = gridFsOperations.store(file.getInputStream(), file.getOriginalFilename(), file.getContentType());
        return fileId.toString();
    }

    public GridFsResource getFile(String fileId) {
        GridFSFile file = gridFsOperations.findOne(query(where("_id").is(fileId)));
        return gridFsOperations.getResource(file);
    }


    public void deleteFileAndRemoveFromEquipment(String fileId) {
        ObjectId objectId = new ObjectId(fileId);

        // Step 1: Delete from GridFS
        gridFsOperations.delete(query(where("_id").is(objectId)));

        // Step 2: Remove from equipment.documents
        Query documentsQuery = new Query(Criteria.where("documents._id").is(objectId));
        Update updateDocuments = new Update().pull("documents", Query.query(Criteria.where("_id").is(objectId)));
        mongoTemplate.updateMulti(documentsQuery, updateDocuments, Equipment.class);

        // Step 3: Remove from equipment.archive
        Query archiveQuery = new Query(Criteria.where("archive._id").is(objectId));
        Update updateArchive = new Update().pull("archive", Query.query(Criteria.where("_id").is(objectId)));
        mongoTemplate.updateMulti(archiveQuery, updateArchive, Equipment.class);
    }


}
